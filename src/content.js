if (window.location.protocol !== 'chrome-extension:') {
    var force = 100;

    async function getDataFromStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, data => {
                resolve(data[key]);
            });
        });
    }

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
    style.setAttribute('no-scrollbar-style', '');
    style.textContent = `
        body::-webkit-scrollbar {
            display: none;
        }
    `;

    async function addScrollLimiting(url) {
        force = await getDataFromStorage('force') ?? force;
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        document.head.appendChild(style);
    }

    function removeScrollLimiting() {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeydown);
        document.querySelectorAll('[no-scrollbar-style]').forEach(e => e.remove());
    }

    addScrollLimiting(window.location.href);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "removeEffects") {
            removeScrollLimiting();
            sendResponse({ status: "success" });
        }
    });
}