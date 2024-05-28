import psl from 'psl';

function addProtocol(url) {
    if (!/^\w+:\/\//i.test(url)) {
        return 'https://' + url;
    }
    return url;
}

function isUrlMatching(base, target) {
    // parse urls
    let baseURL = null;
    let targetURL = null;
    try {
        baseURL = new URL(addProtocol(base));
        targetURL = new URL(addProtocol(target));
    } catch (error) {
        return false;
    }

    // extract domain parts using psl
    const baseParsed = psl.parse(baseURL.hostname);
    const targetParsed = psl.parse(targetURL.hostname);

    // check if domain and tld are matching
    const isDomainMatching = baseParsed.domain === targetParsed.domain && baseParsed.tld === targetParsed.tld;
    if (!isDomainMatching) return false;

    // check if the base subdomain is a suffix of the target subdomain
    if (!baseParsed.subdomain || baseParsed.subdomain === 'www') baseParsed.subdomain = '';
    if (!targetParsed.subdomain || targetParsed.subdomain === 'www') targetParsed.subdomain = '';
    const isSubdomainMatching = targetParsed.subdomain.endsWith(baseParsed.subdomain); // can cause issues when the suffix is a part of the subdomain
    if (!isSubdomainMatching) return false;

    if (!baseURL.pathname) baseURL.pathname = '';
    if (!targetURL.pathname) targetURL.pathname = '';
    const isPathMatching = targetURL.pathname.startsWith(baseURL.pathname);
    if (!isPathMatching) return false;

    return true;
}

// Test cases
// console.log(isUrlMatching('example.com/', 'https://sub.example.com')); // true
// console.log(isUrlMatching('www.example.com', 'https://example.com/some/path/')); // true
// console.log(isUrlMatching('example.com', 'https://sub.example.com/')); // true
// console.log(isUrlMatching('sub.example.com', 'https://sub.example.com/another/path')); // true
// console.log(isUrlMatching('example.com/path', 'https://example.com/path/to/somewhere/else')); // true
// console.log(isUrlMatching('example.com/path', 'https://example.com/otherpath')); // false
// console.log(isUrlMatching('sub.example.com', 'https://example.com')); // false

async function getDataFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data[key]);
        });
    });
}

async function limitScroll(url) {
    const isEnabled = await getDataFromStorage('isEnabled');
    if (!isEnabled) return false;

    const urls = await getDataFromStorage('urls');
    if (!!urls && !urls.some(u => isUrlMatching(u, url))) return false;

    return true;
}

async function main() {
    if (!(await limitScroll(window.location.href))) return;

    const force = await getDataFromStorage('force') ?? 50;

    // slows scrolling down as the user scrolls down
    function handleWheel(event) {
        event.preventDefault();
        var scrollTopSpeed = event.deltaY;

        if (event.deltaY > 0) {
            const scrollFactor = force / (force + document.documentElement.scrollTop);
            scrollTopSpeed *= scrollFactor;
        }

        document.documentElement.scrollTop += scrollTopSpeed;
    }

    // prevent scrolling with arrow keys and space bar
    function handleKeydown(event) {
        if ((event.key == 'ArrowDown' || event.key == 'ArrowUp' || event.key == ' ') && event.target == document.body) {
            event.preventDefault();
        }
    }

    // hide scrollbar
    const style = document.createElement('style');
    style.textContent = `
        body::-webkit-scrollbar {
            display: none;
        }
    `;

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    document.head.appendChild(style);
}

main();