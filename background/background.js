//-----------------------------------------------------------------------------
// @ts-check
"use strict";

const EXTENSION_NAME = "(VK Anti Ads & Comments)";

let totalAdsRemoved = 0;
let totalTestAdsRemoved = 0;

console.log(`start background ${EXTENSION_NAME}`);

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

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
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
  }

  if (message.testAdsRemoved !== undefined) {
    console.log(
      `got message -> test ads removed in ${EXTENSION_NAME}: ${message.testAdsRemoved}`
    );
    totalTestAdsRemoved += message.testAdsRemoved;
    chrome.storage.session.set({ totalTestAdsRemoved });
  }

  if (message.type === "resetButtonClicked") {
    console.log(`got message -> resetButtonClicked in ${EXTENSION_NAME}`);
    totalAdsRemoved = 0;
    totalTestAdsRemoved = 0;
    chrome.storage.session.set({ totalAdsRemoved, totalTestAdsRemoved });
    chrome.runtime.sendMessage({ testAdsRemoved: 0 });
    chrome.runtime.sendMessage({ adsRemoved: 0 });
  }
});

/** popup просит счётчики через порт */
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((popupMessage) => {
    if (port.name === "popup" && popupMessage.type === "GET_POPUP_DATA") {
      port.postMessage({
        type: "POPUP_DATA",
        data: totalAdsRemoved,
        test: totalTestAdsRemoved,
      });
    }
  });
});

// chrome.runtime.onSuspend.addListener(() => {
//   console.log("Service worker будет остановлен. Сохраняем данные...");
//   chrome.storage.session.set({ totalAdsRemoved });
//   chrome.storage.session.set({ totalTestAdsRemoved });
//   console.log("Временные данные сохранены.");
// });

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
