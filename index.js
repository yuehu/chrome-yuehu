/**
 * Content scripts for Yuehu.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */

// TODO: add read later icon to selected websites

/**
 * Observe the DOM changes.
 */
function observer(callback) {
  var mo = new WebKitMutationObserver(callback);
  mo.observer(document.body, {childList: true});
}
