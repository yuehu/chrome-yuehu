/**
 * Content scripts for Yuehu.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */


/**
 * Support for zhihu.com
 */
var ZHIHU_PATTERN = /www\.zhihu\.com\/question\/\d+/;
var ZHIHU_CACHE = {};
function zhihu() {
  var m = location.href.match(/www\.zhihu\.com\/question\/(\d+)/);
  if (!m) return;

  var question = m[1];

  var items = document.querySelectorAll('.zm-item-answer');

  var createIcon = function(item) {
    var token = item.dataset.atoken;
    if (!token || ZHIHU_CACHE[token] || len(item.innerText) < 200) {
      return;
    }
    ZHIHU_CACHE[token] = true;

    var anchor = document.createElement('a');
    anchor.href = 'javascript:;';
    anchor.className = 'meta-item';
    anchor.innerHTML = '<i class="z-icon-collect"></i>' + i18n('name');

    anchor.onclick = function(e) {
      e.preventDefault();
      readlater('http://www.zhihu.com/question/' + question + '/answer/' + token);
    };
    var position = item.querySelector('.zu-autohide');
    position.parentNode.insertBefore(anchor, position);
  };

  for (var i = 0; i < items.length; i++) {
    createIcon(items[i]);
  }
}
if (ZHIHU_PATTERN.test(location.href)) {
  observer(zhihu);
}


/**
 * Observe the DOM changes.
 */
function observer(callback) {
  var mo = new WebKitMutationObserver(callback);
  mo.observe(document.body, {childList: true});
}

/**
 * Get i18n translation.
 */
function i18n(name, options) {
  return chrome.i18n.getMessage(name, options);
}

/**
 * Get pure text length.
 */
function len(text) {
  text = text.replace(/\s+/, '');
  return text.length;
}

/**
 * Communicate with background, save the givent `url`.
 */
var port = chrome.runtime.connect({name: 'yuehu'});
function readlater(url) {
  port.postMessage({url: url});
}
