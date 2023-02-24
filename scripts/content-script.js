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
  
  let ads = getElementsByText(observeNode, adsText, 'span');
  ads.forEach(adSpan => {
    let adBlock = adSpan.parentNode.parentNode.parentNode.parentNode;
    if (adBlock) {
      adBlock.style.display = 'none';
      console.log('[VK Anti-Ads]: found and removed vk ad post');
    }
  });
}
//-----------------------------------------------------------------------------
function getElementsByText(startNode, str, tag) {

  return Array.prototype.slice.call(
    startNode.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim()
    );

}
//-----------------------------------------------------------------------------
//------------------------------END OF FILE------------------------------------
//-----------------------------------------------------------------------------
