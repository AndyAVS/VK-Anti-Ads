//-----------------------------------------------------------------------------
'use strict';
//-----------------------------------------------------------------------------
const ADS_TEXT = 'Реклама в сообществе';
const REPLIES_TEXT = 'replies';
const observeNode = document;
//-----------------------------------------------------------------------------
new MutationObserver(() => {

  RemoveBlock();

}).observe(observeNode, { subtree: true, childList: true });
//-----------------------------------------------------------------------------
function RemoveBlock() {

  const ads = getElementsByText(observeNode, ADS_TEXT, 'span');
  ads.forEach(adSpan => {
    let adBlock = adSpan.parentNode.parentNode.parentNode.parentNode;
    if (adBlock) {
      adBlock.style.display = 'none';
      console.log('[VK Anti-Ads]: found and removed vk ad post');
    }
  });

  const repliesDivs = getElementsByClassName(observeNode, REPLIES_TEXT, 'div')
  repliesDivs.forEach(div => div.style.display = 'none');
}
//-----------------------------------------------------------------------------
function getElementsByText(startNode, strText, tag) {

  return Array.prototype.slice.call(
    startNode.getElementsByTagName(tag)).filter(el => el.textContent.trim() === strText.trim()
    );

}
//-----------------------------------------------------------------------------
function getElementsByClassName(startNode, className, tag) {

  return Array.prototype.filter.call(startNode.getElementsByClassName(className),
    (element) => element.nodeName === tag.toUpperCase()
  );
}
//-----------------------------------------------------------------------------
//------------------------------END OF FILE------------------------------------
//-----------------------------------------------------------------------------
