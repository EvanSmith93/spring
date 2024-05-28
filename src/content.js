import URI from 'urijs';

async function getDataFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data[key]);
        });
    });
}

async function isUrlInList(url) {
    const isEnabled = await getDataFromStorage('isEnabled');
    if (!isEnabled) return false;

    const urls = await getDataFromStorage('urls');
    if (!!urls && !urls.some(url => {
        url = new URI(url.toLowerCase()).normalize().toString();
        var currentUrl = new URI(window.location.href.toLowerCase()).normalize().toString();

        const protocolRegex = /(^\w*:)\/\//;
        const wwwRegex = /www./;
        const trailingSlashRegex = /\/$/;
        url = url.replace(protocolRegex, '');
        url = url.replace(wwwRegex, '');
        url = url.replace(trailingSlashRegex, '');
        currentUrl = currentUrl.replace(protocolRegex, '');
        currentUrl = currentUrl.replace(wwwRegex, '');
        currentUrl = currentUrl.replace(trailingSlashRegex, '');

        return currentUrl.startsWith(url);
    })) return false;

    return true;
}

async function main() {
    if (!(await isUrlInList(window.location.href))) return;

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