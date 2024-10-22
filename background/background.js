//-----------------------------------------------------------------------------
// @ts-check
"use strict";

let totalAdsRemoved = 0;
let totalTestAdsRemoved = 0;

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  const EXTENSION_NAME = "(VK Anti Ads & Comments)";

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
    totalAdsRemoved = message.adsRemoved;
  }

  if (message.testAdsRemoved !== undefined) {
    console.log(
      `got message -> test ads removed in ${EXTENSION_NAME}: ${message.testAdsRemoved}`
    );
    totalTestAdsRemoved = message.testAdsRemoved;
  }

  /** в content-script сообщение через активную вкладку */
  if (message.type === "resetButtonClicked") {
    console.log(`got message -> resetButtonClicked in ${EXTENSION_NAME}`);

    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const activeTab = tabs[0];
    //   if (activeTab) {
    //     try {
    //       chrome.tabs.sendMessage(activeTab.id, { type: "resetButtonClicked" }
    //         ,(response) => {
    //         if (chrome.runtime.lastError) {
    //           throw new Error(chrome.runtime.lastError.message);
    //         }
    //       }
    //     );
    //     } catch (e) {
    //       /** я знаю, что это плохо */
    //       console.warn("Ошибка отправки сообщения:", e.message);
    //     }
    //   }
    // });
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