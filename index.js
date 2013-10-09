/**
 * Content scripts for Yuehu.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */


/**
 * Observe the DOM changes.
 */
function observer(callback, config) {
  config = config || {attributes: true, childList: true, characterData: true, subtree: true};
  var mo = new WebKitMutationObserver(callback);
  mo.observe(document.body, config);
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

/**
 * require and execute the site script.
 */
function execSite(name) {
  var script = 'site/' + name + '.js';
  port.postMessage({script: script});
}
