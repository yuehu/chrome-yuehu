
/**
 * Defined values.
 */
const VERSION = '0.1.0';
const ACTIVE_ICON = 'icons/icon-active-19.png';
const INACTIVE_ICON = 'icons/icon-inactive-19.png';

var SERVER_URL;

// Online Server
SERVER_URL = 'https://yuehu.me/me/readlater';

// Development Server
// SERVER_URL = 'http://127.0.0.1:8000/me/readlater';


/**
 * Set the browser action icon to active icon.
 */
function setIcon(path) {
  chrome.browserAction.setIcon({path: path});
}


/**
 * Flash a message for screen display.
 */
function flashMessage(msg, category) {
}


/**
 * Validate the given `url`.
 */
function isValidUrl(url) {
  if (!/^https?\:\/\//.test(url)) {
    return false;
  }

  var pattern = /^https?:\/\/([^\/]+)\/(.*)$/;
  var m = url.match(pattern);
  if (!m) {
    return false;
  }
  var urlpath = m[2];
  if (!urlpath) {
    // We don't parse homepage
    return false;
  }

  var domain = m[1], i;

  var blockPaths = [
    '/search',
    '/login',
    '/logout',
    '/register',
    '/signin',
    '/signup',
    '/signout',
    '/account'
  ];
  for (i = 0; i < blockPaths.length; i++) {
    if (~urlpath.indexOf(blockPaths[i])) {
      return false;
    }
  }

  var sameServices = [
    'instapaper.com',
    'readability.com',
    'getpocket.com',
    'quote.fm',
    'reader.mx'
  ];
  var socialDomains = [
    'weibo.com',
    'www.weibo.com',
    'twitter.com',
    'quora.com',
    'www.quora.com'
  ];
  var searchDomains = [
    'www.google.com',
    'www.baidu.com',
    'cn.bing.com',
    'www.bing.com',
    'www.yahoo.com',
    'cn.yahoo.com',
    'www.soso.com',
    'www.sogou.com'
  ];
  var blockDomains = [
    'www.amazon.com',
    'www.amazon.cn',
    'www.360.com',
    'www.taobao.com',
    'www.infoq.com',
    'www.iteye.com',
    'www.cnbeta.com'
  ];
  blockDomains = blockDomains.concat(
    sameServices, socialDomains, searchDomains
  );
  for (i = 0; i < blockDomains.length; i++) {
    if (domain === blockDomains[i]) {
      return false;
    }
  }
  return true;
}


/**
 * Put current webpage to yuehu reading list.
 */
function record(url) {
  if (!/^https?\:\/\//.test(url)) {
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.open('POST', SERVER_URL, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var type = xhr.status / 100 | 0;
      if (type === 2) {
        setIcon(ACTIVE_ICON);
        localStorage[url] = new Date().valueOf();
      } else {
        // TODO: flash Error message
      }
    }
  };

  var body = new FormData();
  body.append('link', url);

  xhr.setRequestHeader('X-Chrome-Extension', VERSION);
  xhr.send(body);
}


/**
 * Detect if current webpage is active.
 */
function detectStatus(url) {
  if (isValidUrl(url)) {
    var cache = localStorage[url];
    var now = new Date().valueOf();
    // only cache for 1 hour
    if (cache && now - cache < 3600000) {
      setIcon(ACTIVE_ICON);
      return;
    }
  }
  setIcon(INACTIVE_ICON);
}


function chromeListener() {
/**
 * Put current webpage to yuehu reading list when clicked.
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  record(tab.url);
});

/**
 * Refreshing browser action icon.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.status && changeInfo.url) {
    detectStatus(changeInfo.url);
  }
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    detectStatus(tab.url);
  });
});
}
