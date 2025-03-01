import { MAX_FORCE, MIN_FORCE } from "../Home";
import { getDataFromStorage } from "../utils/storage";
import { PreventKeyScrolling } from "./keyScrolling";
import { ScrollbarHider } from "./scrollbar";
import { WheelLimiter } from "./wheel";

async function main() {
  if (window.location.protocol === "chrome-extension:") return;
  if (window.springScriptEnabled) return;

  const force =
    (await getDataFromStorage("force")) ?? (MAX_FORCE + MIN_FORCE) / 2;
  const action = (await getDataFromStorage("action")) ?? "spring";

  function addScrollLimiting() {
    window.springScriptEnabled = true;

    WheelLimiter.on(action, force);
    PreventKeyScrolling.on();
    ScrollbarHider.on();
  }

  function removeScrollLimiting() {
    window.springScriptEnabled = false;

    console.log("REMOVING");
    WheelLimiter.off();
    PreventKeyScrolling.off();
    ScrollbarHider.off();
  }

  addScrollLimiting();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "removeEffects") {
      removeScrollLimiting();
      sendResponse({ status: "success" });
    }
  });
}

main();
