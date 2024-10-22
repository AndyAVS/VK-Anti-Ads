//-----------------------------------------------------------------------------
// @ts-check
"use strict";
//-----------------------------------------------------------------------------
const POPUP_EXT_STORAGE_KEY = "extensionEnabled";
const BUTTON_ID = "toggle-btn";
const RESET_BUTTON_ID = "reset-btn";
const ENABLED_CAPTION = "Включен";
const DISABLED_CAPTION = "Отключен";
const ENABLED_CLASS = "btn btn__enabled";
const DISABLED_CLASS = "btn btn__disabled";
const ADS_COUNTER_ID = "ads-removed-counter";
const TEST_ADS_COUNTER_ID = "test-ads-removed-counter";

/**
 * @typedef {Object} PopupMessage
 * @property {string} type - Тип сообщения (например, 'RECEIVED_DATA').
 * @property {number} data - Данные, переданные с сообщением.
 * @property {number} test - Данные, переданные с сообщением.
 */

/**
 * @param {HTMLElement} button
 */
const EnableButton = (button) => {
  button.textContent = ENABLED_CAPTION;
  button.className = ENABLED_CLASS;
};

/**
 * @param {HTMLElement} button
 */
const DisableButton = (button) => {
  button.textContent = DISABLED_CAPTION;
  button.className = DISABLED_CLASS;
};

/**
 * @param {HTMLElement} button
 * @param {boolean} state
 */
const SetButtonState = (button, state) => {
  state ? EnableButton(button) : DisableButton(button);
};

/**
 * @param {string} elementId
 * @param {*} data
 */
const SetElementTextContent = (elementId, data) => {
  const element = document.getElementById(elementId);
  if (element !== null) {
    element.textContent = data.toString();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById(BUTTON_ID);

  if (toggleButton == null) {
    return;
  } else {
    chrome.storage.local.get(POPUP_EXT_STORAGE_KEY, (result) => {
      SetButtonState(toggleButton, result.extensionEnabled);
    });

    toggleButton.addEventListener("click", () => {
      chrome.storage.local.get(POPUP_EXT_STORAGE_KEY, (result) => {
        const newState = !result.extensionEnabled;

        chrome.storage.local.set({ extensionEnabled: newState }, () => {
          SetButtonState(toggleButton, newState);

          /** Отправка сообщения другим частям расширения, что состояние изменилось*/
          chrome.runtime.sendMessage({ enabled: newState });
        });
      });
    });
  }

  const resetButton = document.getElementById(RESET_BUTTON_ID);
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "resetButtonClicked" });
    });
  }

  /**
   * ловим из content-script, если открыт popup и было срабатывание
   * чтобы изменилось на лету
   * возможно лишнее
   */
  chrome.runtime.onMessage.addListener((message) => {
    if (message.adsRemoved !== undefined) {
      SetElementTextContent(ADS_COUNTER_ID, message.adsRemoved);
    }
    if (message.testAdsRemoved !== undefined) {
      SetElementTextContent(TEST_ADS_COUNTER_ID, message.testAdsRemoved);
    }
  });

  /**
   * при открытии popup спрашиваем у background
   * через port chrome
   */
  const port = chrome.runtime.connect({ name: "popup" });

  port.postMessage({ type: "GET_POPUP_DATA" });

  port.onMessage.addListener(
    /** @param { PopupMessage } message*/ (message) => {
      if (message.type === "POPUP_DATA") {
        SetElementTextContent(ADS_COUNTER_ID, message.data);
        SetElementTextContent(TEST_ADS_COUNTER_ID, message.test);
      }
    }
  );
});
