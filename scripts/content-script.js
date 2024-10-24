//-----------------------------------------------------------------------------
// @ts-check
"use strict";
//-----------------------------------------------------------------------------
const CONTENT_EXTENSION_NAME = "VK Anti Ads";
const CONTENT_STORAGE_KEY = "extensionEnabled";
//-----------------------------------------------------------------------------
const OBSERVE_NODE = document;
const ADS_TEXT = "Реклама";
const REPLIES_TEXT = "replies";
const ADS_CLASS = "PostHeaderSubtitle--layoutWithWarning";
const ADS_CLASS_CONTAINS = "_ads_";
const MARKET_CLASS_CONTAINS = "MarketItems";
const ADS_IN_PUBLIC = "PostHeaderSubtitle__item";
//-----------------------------------------------------------------------------

console.log(`${CONTENT_EXTENSION_NAME} content-script running`);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "resetButtonClicked") {
    console.log(`${CONTENT_EXTENSION_NAME} content-script resetButtonClicked`);
  }
});
//-----------------------------------------------------------------------------
chrome.storage.local.get(CONTENT_STORAGE_KEY, (result) => {
  if (result.extensionEnabled) {
    console.log(`${CONTENT_EXTENSION_NAME} запущено во включенном состоянии`);

    new MutationObserver(() => {
      TestRemoveBlock();
      RemoveAdBlock();
      RemoveAdInPublicBlock();
      RemoveComments();

    }).observe(OBSERVE_NODE, { subtree: true, childList: true });
  } else {
    console.log(`${CONTENT_EXTENSION_NAME} запущено в выключенном состоянии`);
  }
});
//-----------------------------------------------------------------------------
function TestRemoveBlock() {
  const funcName = "TestRemoveBlock()";
  let adsRemoved = 0;

  let ads = getElementsContainingTextContent(OBSERVE_NODE, ADS_TEXT, "span");

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      adBlock.remove();
      console.log(
        `${CONTENT_EXTENSION_NAME} ${funcName} (test condition 1)`
      );
      adsRemoved++;
    }
  });

  ads = getElementsContainingTextContent(OBSERVE_NODE, ADS_TEXT, "div");

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      adBlock.remove();
      console.log(
        `${CONTENT_EXTENSION_NAME} ${funcName} (test condition 2)`
      );
      adsRemoved++;
    }
  });

  if (adsRemoved) {
    console.log(
      `${CONTENT_EXTENSION_NAME} ${funcName} ${adsRemoved}`
    );
    chrome.runtime.sendMessage({testAdsRemoved: adsRemoved });
  }
}
//-----------------------------------------------------------------------------
function RemoveAdBlock() {
  const funcName = "RemoveAdBlock()";
  let adsRemoved = 0;

  const ads = [
    ...getElementsByClassName(OBSERVE_NODE, ADS_CLASS, "div"),
    ...getElementsContainingClassName(OBSERVE_NODE, ADS_CLASS_CONTAINS, "div"),
    ...getElementsContainingClassName(
      OBSERVE_NODE,
      MARKET_CLASS_CONTAINS,
      "div"
    ),
  ];

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      adBlock.remove();
      console.log(`${CONTENT_EXTENSION_NAME}: removed vk ad post`);
      adsRemoved++;
    }
  });

  if (adsRemoved) {
    console.log(
      `${CONTENT_EXTENSION_NAME} ${funcName} ${adsRemoved}`
    );
    chrome.runtime.sendMessage({ adsRemoved });
  }
}
//-----------------------------------------------------------------------------
function RemoveAdInPublicBlock() {
  const funcName = "RemoveAdInPublicBlock()";
  let adsRemoved = 0;

  const ads = getElementsByClassName(OBSERVE_NODE, ADS_IN_PUBLIC, "span");

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      adBlock.remove();
      console.log(`${CONTENT_EXTENSION_NAME}: removed ad in public post`);
      adsRemoved++;
    }
  });

  if (adsRemoved) {
    console.log(`${CONTENT_EXTENSION_NAME} ${funcName} ${adsRemoved}`);
    chrome.runtime.sendMessage({ adsRemoved });
  }
}
//-----------------------------------------------------------------------------
function RemoveComments() {
  const funcName = "RemoveComments()";
  const replies = getElementsByClassName(OBSERVE_NODE, REPLIES_TEXT, "div");
  replies.forEach((div) => div.remove());
}
//-----------------------------------------------------------------------------
/**
 * @param {HTMLElement | Document} startNode
 * @param {string} strText
 * @param {string} tag
 * @returns {HTMLElement[]}
 */
function getElementsByTextContent(startNode, strText, tag) {
  return Array.prototype.filter.call(
    startNode.getElementsByTagName(tag),
    (element) => element.textContent.trim() === strText.trim()
  );
}
//-----------------------------------------------------------------------------
/**
 * @param {HTMLElement | Document} startNode
 * @param {string} strText
 * @param {string} tag
 * @returns {HTMLElement[]}
 */
function getElementsContainingTextContent(startNode, strText, tag) {
  return Array.prototype.filter.call(
    startNode.getElementsByTagName(tag),
    (element) => element.textContent.includes(strText.trim())
  );
}
//-----------------------------------------------------------------------------
/**
 * @param {HTMLElement | Document} startNode
 * @param {string} className
 * @param {string} tag
 * @returns {HTMLElement[]}
 */
function getElementsByClassName(startNode, className, tag) {
  return Array.prototype.filter.call(
    startNode.getElementsByClassName(className),
    (element) => element.nodeName === tag.toUpperCase()
  );
}
//-----------------------------------------------------------------------------
/**
 * @param {HTMLElement | Document} startNode
 * @param {string} classText
 * @param {string} tag
 * @returns {HTMLElement[]}
 */
function getElementsContainingClassName(startNode, classText, tag) {
  return Array.prototype.filter.call(
    startNode.querySelectorAll(tag),
    (element) =>
      Array.from(element.classList).some((className) =>
        className.includes(classText)
      )
  );
}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
