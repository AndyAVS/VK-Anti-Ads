//-----------------------------------------------------------------------------
'use strict';
//-----------------------------------------------------------------------------
const adsText = 'Реклама в сообществе';
const observeNode = document;
//-----------------------------------------------------------------------------
new MutationObserver(() => {
  RemoveBlock();
}).observe(observeNode, { subtree: true, childList: true });
//-----------------------------------------------------------------------------
function RemoveBlock() {
  let ads = getElementsByText(adsText, 'span');
  ads.forEach(adSpan => {
    console.log('found vk ad');
    let adBlock = adSpan.parentNode.parentNode.parentNode.parentNode;
    if (adBlock) {
      adBlock.style.display = 'none';
    }
  });
}
//-----------------------------------------------------------------------------
function getElementsByText(str, tag) {
  return Array.prototype.slice.call(
    observeNode.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim()
    );
}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
