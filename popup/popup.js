//-----------------------------------------------------------------------------
// @ts-check
"use strict";
//-----------------------------------------------------------------------------
const POPUP_EXT_STORAGE_KEY = "extensionEnabled";
const BUTTON_ID = "toggle-btn";
const ENABLED_CAPTION = "Включен";
const DISABLED_CAPTION = "Отключен";
const ENABLED_CLASS = "btn__enabled";
const DISABLED_CLASS = "btn__disabled";

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById(BUTTON_ID);

  /** поклон в сторону TypeScript */
  if (toggleButton == null) return;

  chrome.storage.local.get(POPUP_EXT_STORAGE_KEY, (result) => {
    if (result.extensionEnabled) {
      toggleButton.textContent = ENABLED_CAPTION;
      toggleButton.className = ENABLED_CLASS;
    } else {
      toggleButton.textContent = DISABLED_CAPTION;
      toggleButton.className = DISABLED_CLASS;
    }
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(POPUP_EXT_STORAGE_KEY, (result) => {
      const newState = !result.extensionEnabled;

      chrome.storage.local.set({ extensionEnabled: newState }, () => {
        toggleButton.textContent = newState
          ? ENABLED_CAPTION
          : DISABLED_CAPTION;
        toggleButton.className = newState ? ENABLED_CLASS : DISABLED_CLASS;

        /** Отправка сообщения другим частям расширения, что состояние изменилось*/
        chrome.runtime.sendMessage({ enabled: newState });
      });
    });
  });
});
