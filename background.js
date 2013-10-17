/**
 * Background scripts for Yuehu.
 *
 * Copyright (c) 2013 by Hsiaoming Yang
 */

/**
 * Defined values.
 */
const VERSION = '0.1.4';
const ACTIVE_ICON = 'icons/icon-active-19.png';
const INACTIVE_ICON = 'icons/icon-inactive-19.png';

/**
 * Insert google analytics
 */
var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34098939-1']);
_gaq.push(['_trackPageview']);


var SERVER_URL;

// Online Server
SERVER_URL = 'https://yuehu.me/';

// Development Server
// SERVER_URL = 'http://127.0.0.1:8000/';


/**
 * Put current webpage to yuehu reading list.
 */
function record(url) {
  if (!isValidUrl(url)) {
    flashMessage(url, i18n('invalidurl'), i18n('error'));
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.open('POST', SERVER_URL + 'me/readlater', true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var type = parseInt(xhr.status / 100, 10);
      if (type === 2) {
        var response = JSON.parse(xhr.responseText);
        if (response.location) {
          return newTab(response.location);
        }
        if (response.error) {
          _gaq.push(['_trackEvent', 'Chrome', 'Error', url]);
          flashMessage(url, response.error, i18n('error'));
        } else {
          setIcon(ACTIVE_ICON);
          sessionStorage[url] = response.id;
          flashMessage(url, response.title, i18n('saved'));
        }
      } else {
        _gaq.push(['_trackEvent', 'Chrome', 'Fail', url]);
        flashMessage(url, 'Code: ' + xhr.status);
      }
    }
  };

  var body = new FormData();
  body.append('url', url);

  xhr.setRequestHeader('X-Browser-Extension', 'Chrome ' + VERSION);
  xhr.send(body);
}


/**
 * Detect if current webpage is active.
 */
function detectStatus(url) {
  if (isValidUrl(url)) {
    if (sessionStorage[url]) {
      setIcon(ACTIVE_ICON);
      return;
    }
  }
  setIcon(INACTIVE_ICON);
}


/**
 * Put current webpage to yuehu reading list when clicked.
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  _gaq.push(['_trackEvent', 'Chrome', 'BrowserAction', tab.url]);
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

/**
 * Create context menus.
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'yuehu') {
    _gaq.push(['_trackEvent', 'Chrome', 'ContextMenu', info.linkUrl]);
    record(info.linkUrl);
  }
});
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'yuehu',
    title: i18n('name'),
    contexts: ['link']
  });
});

/**
 * Message port connection.
 */
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === 'yuehu');
  port.onMessage.addListener(function(msg) {
    if (msg.url) {
      record(msg.url);
      _gaq.push(['_trackEvent', 'Chrome', 'Message', msg.url]);
    }
    if (msg.site) {
      _gaq.push(['_trackEvent', 'Chrome', 'Site', msg.site]);
    }
    if (msg.script) {
      chrome.tabs.executeScript(null, {file: msg.script});
    }
  });
});

function noop() {}

/**
 * Set the browser action icon to active icon.
 */
function setIcon(path) {
  chrome.browserAction.setIcon({path: path});
}


/**
 * Flash a message for notification.
 */
function flashMessage(id, message, category) {
  var options = {
    type: 'basic',
    title: category || i18n('name'),
    message: message,
    iconUrl: 'icons/icon-128.png'
  };
  chrome.notifications.create(id, options, function(notificationId) {
    setTimeout(function() {
      chrome.notifications.clear(notificationId, noop);
    }, 2600);
  });
}
chrome.notifications.onClicked.addListener(function(notificationId) {
  var id = sessionStorage[notificationId];
  if (id) {
    newTab(SERVER_URL + 'me/read/' + id);
  }
});


/**
 * Get i18n translation.
 */
function i18n(name, options) {
  return chrome.i18n.getMessage(name, options);
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
    'stackoverflow.com',
    'www.stackoverflow.com',
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
 * Create a new tab with the given `url`.
 */
function newTab(url) {
  chrome.tabs.create({url: url});
}
