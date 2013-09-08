/**
 * Content scripts for Yuehu.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */


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
