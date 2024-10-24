//-----------------------------------------------------------------------------
// @ts-check
"use strict";

const EXTENSION_NAME = "(VK Anti Ads & Comments)";

let totalAdsRemoved = 0;
let totalTestAdsRemoved = 0;

console.log(`start background ${EXTENSION_NAME}`);

function updateBadge(counters) {
  chrome.action.setBadgeText({ text: counters.toString() }).catch((err) => {
    console.warn(`Error update badge: ${err.message}`);
  });
}

chrome.storage.session.get(
  ["totalAdsRemoved", "totalTestAdsRemoved"],
  (result) => {
    totalAdsRemoved = parseInt(result.totalAdsRemoved) || 0;
    totalTestAdsRemoved = parseInt(result.totalTestAdsRemoved) || 0;
    console.log(
      `get background ${EXTENSION_NAME} ${totalAdsRemoved} ${totalTestAdsRemoved}`
    );
  }
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  let isUpdated = false;

  if (message.enabled !== undefined) {
    if (message.enabled) {
      console.log(`${EXTENSION_NAME} включен`);
    } else {
      console.log(`${EXTENSION_NAME} выключен`);
    }
  }

  if (message.adsRemoved !== undefined) {
    console.log(
      `got message -> ads removed in ${EXTENSION_NAME}: ${message.adsRemoved}`
    );
    totalAdsRemoved += message.adsRemoved;
    chrome.storage.session.set({ totalAdsRemoved });
    isUpdated = true;
  }

  if (message.testAdsRemoved !== undefined) {
    console.log(
      `got message -> test ads removed in ${EXTENSION_NAME}: ${message.testAdsRemoved}`
    );
    totalTestAdsRemoved += message.testAdsRemoved;
    chrome.storage.session.set({ totalTestAdsRemoved });
    isUpdated = true;
  }

  if (message.type === "resetButtonClicked") {
    console.log(`got message -> resetButtonClicked in ${EXTENSION_NAME}`);
    totalAdsRemoved = 0;
    totalTestAdsRemoved = 0;
    chrome.storage.session.set({ totalAdsRemoved, totalTestAdsRemoved });
    isUpdated = true;
  }

  if (message.type === "GET_POPUP_DATA") {
    console.log(`got message -> GET_POPUP_DATA in ${EXTENSION_NAME}`);
    chrome.storage.session.get(
      ["totalAdsRemoved", "totalTestAdsRemoved"],
      (result) => {
        const ads = parseInt(result.totalAdsRemoved) || 0;
        const test = parseInt(result.totalTestAdsRemoved) || 0;
        console.log(`in response ${ads} ${test}`);
        chrome.runtime.sendMessage({
          type: "POPUP_DATA",
          data: ads,
          test: test,
        })
        .catch((e) => console.warn('Error send POPUP_DATA '+ e.message));
      }
    );
  }

  if (isUpdated) {
    updateBadge(totalAdsRemoved + totalTestAdsRemoved);
    isUpdated = false;
  }
});

// chrome.runtime.onSuspend.addListener(() => {
//   console.log("Service worker будет остановлен. Сохраняем данные...");
//   chrome.storage.session.set({ totalAdsRemoved });
//   chrome.storage.session.set({ totalTestAdsRemoved });
//   console.log("Временные данные сохранены.");
// });

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.setBadgeBackgroundColor({ color: "gray" });
  await chrome.action.setBadgeTextColor({ color: "white" });
  //updateBadge(0);
});

// chrome.runtime.onInstalled.addListener(async () => {
//   for (const cs of chrome.runtime.getManifest().content_scripts) {
//     for (const tab of await chrome.tabs.query({url: cs.matches})) {
//       if (tab.url.match(/(chrome|chrome-extension):\/\//gi)) {
//         continue;
//       }
//       const target = {tabId: tab.id, allFrames: cs.all_frames};
//       if (cs.js[0]) chrome.scripting.executeScript({
//         files: cs.js,
//         injectImmediately: cs.run_at === 'document_start',
//         // @ts-ignore
//         world: cs.world, // requires Chrome 111+
//         target,
//       });
//       if (cs.css && cs.css[0]) chrome.scripting.insertCSS({
//         files: cs.css,
//         // @ts-ignore
//         origin: cs.origin,
//         target,
//       });
//     }
//   }
// });
