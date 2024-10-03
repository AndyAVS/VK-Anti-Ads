//-----------------------------------------------------------------------------
// @ts-check
"use strict";
//-----------------------------------------------------------------------------
const CONTENT_EXTENSION_NAME = "VK Anti Ads";
const CONTENT_STORAGE_KEY = "extensionEnabled";
const OBSERVE_NODE = document;
const ADS_TEXT = "Реклама";
const REPLIES_TEXT = "replies";
const ADS_CLASS = "PostHeaderSubtitle--layoutWithWarning";
const ADS_CLASS_CONTAINS = "_ads_";
const ADS_IN_PUBLIC = "PostHeaderSubtitle__item";
//-----------------------------------------------------------------------------
chrome.storage.local.get(CONTENT_STORAGE_KEY, (result) => {
  if (result.extensionEnabled) {
    console.log(`${CONTENT_EXTENSION_NAME} запущено во включенном состоянии`);

    new MutationObserver(() => {
      RemoveAdBlock();
      RemoveAdInPublicBlock();
      RemoveComments();
    }).observe(OBSERVE_NODE, { subtree: true, childList: true });
  } else {
    console.log(`${CONTENT_EXTENSION_NAME} запущено в выключенном состоянии`);
  }
});
//-----------------------------------------------------------------------------
function RemoveBlock() {
  const funcName = "RemoveBlock()";
  
  const ads = getElementsByTextContent(OBSERVE_NODE, ADS_TEXT, "span");

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      // @ts-ignore
      adBlock.style.display = "none";
      console.log(`${CONTENT_EXTENSION_NAME}: removed vk ad post`);
    }
  });
}
//-----------------------------------------------------------------------------
function RemoveAdBlock() {
  const funcName = "RemoveAdBlock()";
  
  const ads = [
    ...getElementsByClassName(OBSERVE_NODE, ADS_CLASS, "div"),
    ...getElementsContainingClassName(OBSERVE_NODE, ADS_CLASS_CONTAINS, "div")
  ];

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      // @ts-ignore
      // adBlock.style.display = "none";
      adBlock.remove();
      console.log(`${CONTENT_EXTENSION_NAME}: removed vk ad post`);
    }
  });
}
//-----------------------------------------------------------------------------
function RemoveAdInPublicBlock() {
  const funcName = "RemoveAdInPublicBlock()";

  const ads = getElementsByClassName(OBSERVE_NODE, ADS_IN_PUBLIC, "span");

  ads.forEach((item) => {
    const adBlock = item.closest("div.feed_row ");
    if (adBlock) {
      // @ts-ignore
      // adBlock.style.display = "none";
      adBlock.remove();
      console.log(
        `${CONTENT_EXTENSION_NAME}: removed ad in public post`
      );
    }
  });
}
//-----------------------------------------------------------------------------
function RemoveComments() {
  const funcName = "RemoveСomments()";

  const repliesDivs = getElementsByClassName(OBSERVE_NODE, REPLIES_TEXT, "div");
  
  repliesDivs.forEach((div) => (div.remove()));
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
