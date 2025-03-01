export async function getDataFromStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (data) => {
      resolve(data[key]);
    });
  });
}
