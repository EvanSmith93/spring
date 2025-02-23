import { MAX_FORCE, MIN_FORCE } from "./Home";

function init() {
  if (window.location.protocol === "chrome-extension:") return;
  if (window.springScriptEnabled) return;

  let force = (MAX_FORCE + MIN_FORCE) / 2;
  let action = "spring";

  async function getDataFromStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (data) => {
        resolve(data[key]);
      });
    });
  }

  function handleWheel(event) {
    const root = document.documentElement;

    switch (action) {
      case "spring": {
        event.preventDefault();
        let scrollSpeedY = event.deltaY;

        if (scrollSpeedY > 0) {
          const scrollFactor = force / (force + root.scrollTop ** 1.3);
          scrollSpeedY *= scrollFactor;
        }

        root.scrollBy(0, scrollSpeedY);

        break;
      }
      case "fade": {
        const opacity = Math.min(1, force / (force + root.scrollTop ** 1.1));
        root.style.opacity = opacity;

        break;
      }
    }
  }

  // prevent scrolling with arrow keys and space bar
  function handleKeydown(event) {
    if (
      (event.key == "ArrowDown" ||
        event.key == "ArrowUp" ||
        event.key == " ") &&
      event.target == document.body
    ) {
      event.preventDefault();
    }
  }

  // hide scrollbar
  const style = document.createElement("style");
  style.setAttribute("no-scrollbar-style", "");
  style.textContent = `
        body::-webkit-scrollbar {
            display: none;
        }
    `;

  function removeScrollLimiting() {
    window.springScriptEnabled = false;

    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeydown);
    document
      .querySelectorAll("[no-scrollbar-style]")
      .forEach((e) => e.remove());
  }

  async function addScrollLimiting() {
    window.springScriptEnabled = true;

    force = (await getDataFromStorage("force")) ?? force;
    action = (await getDataFromStorage("action")) ?? action;

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    document.head.appendChild(style);
  }

  addScrollLimiting();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "removeEffects") {
      removeScrollLimiting();
      sendResponse({ status: "success" });
    }
  });
}

init();
