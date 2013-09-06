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
  mo.observer(document.body, {childList: true});
}
