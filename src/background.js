import psl from "psl";

function addProtocol(url) {
  if (!/^\w+:\/\//i.test(url)) {
    return "https://" + url;
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
  const isDomainMatching =
    baseParsed.domain === targetParsed.domain &&
    baseParsed.tld === targetParsed.tld;
  if (!isDomainMatching) return false;

  // check if the base subdomain is a suffix of the target subdomain
  if (!baseParsed.subdomain || baseParsed.subdomain === "www")
    baseParsed.subdomain = "";
  if (!targetParsed.subdomain || targetParsed.subdomain === "www")
    targetParsed.subdomain = "";
  const isSubdomainMatching = targetParsed.subdomain.endsWith(
    baseParsed.subdomain
  ); // could cause issues when the suffix is a part of the subdomain
  if (!isSubdomainMatching) return false;

  if (!baseURL.pathname) baseURL.pathname = "";
  if (!targetURL.pathname) targetURL.pathname = "";
  const isPathMatching = targetURL.pathname.startsWith(baseURL.pathname); // could cause issues where the path is a prefix of the target path (but actually different)
  if (!isPathMatching) return false;

  return true;
}

async function getDataFromStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (data) => {
      resolve(data[key]);
    });
  });
}

async function isScrollLimited(url) {
  const isEnabled = await getDataFromStorage("isEnabled");
  if (!isEnabled) return false;

  const urls = await getDataFromStorage("urls");
  if (!!urls && !urls.some((u) => isUrlMatching(u, url))) return false;

  return true;
}

async function onTabUpdated(tabId, tab) {
  if (await isScrollLimited(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.bundle.js"],
    });
  } else {
    chrome.tabs.sendMessage(tabId, { action: "removeEffects" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    onTabUpdated(tabId, tab);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    onTabUpdated(tabId, tab);
  });
});
