/**
 * Content script for Yuehu
 */


/**
 * Observe the DOM changes.
 */
function observer(callback) {
  var mo = new WebKitMutationObserver(callback);
  mo.observer(document.body, {childList: true});
}
