//-----------------------------------------------------------------------------
// @ts-check
"use strict";

let totalAdsRemoved =  0;
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
});

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
