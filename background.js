//-----------------------------------------------------------------------------
// @ts-check
"use strict";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const EXTENSION_NAME = "(VK Anti Ads & Comments)";
  if (message.enabled !== undefined) {
    if (message.enabled) {
      console.log(`${EXTENSION_NAME} включен`);
    } else {
      console.log(`${EXTENSION_NAME} выключен`);
    }
  }
});
