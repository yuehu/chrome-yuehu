/**
 * Add yuehu button on feedly.com
 */


function feedly(mutations) {
  // all for #latest
  var all = [];

  // one feed view
  var feed = [];

  mutations.forEach(function(mu) {
    if (mu.target) {
      var entry = mu.target.querySelector('.u100Entry');
      if (entry && entry.querySelector) {
        all.push(entry);
      }

      var entries = mu.target.querySelectorAll('.u4Entry');
      for (var i = 0; i < entries.length; i++) {
        var item = entries[i];
        if (item && item.querySelector) {
          feed.push(item);
        }
      }
    }
  });

  var applyFeed = function(item) {
    if (item.querySelector('.action-yuehu')) {
      return;
    }

    var anchor = document.createElement('span');
    anchor.innerHTML = i18n('name');
    anchor.className = 'action action-yuehu';

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      readlater(item.querySelector('.title').href);
      port.postMessage({site: 'Feedly'});
    }, true);

    var position = item.querySelector('.wikiBar');
    var span = document.createElement('span');
    span.style.color = '#cfcfcf';
    span.innerHTML = '&nbsp;//&nbsp; &nbsp;';
    position.appendChild(span);
    position.appendChild(anchor);
  };

  var applyAll = function(item) {
    if (item.querySelector('.action-yuehu')) {
      return;
    }

    var anchor = document.createElement('a');
    anchor.href = '#';
    anchor.title = i18n('name');
    anchor.className = 'action-yuehu';
    var img = document.createElement('img');
    img.src = chrome.extension.getURL('/icons/icon-active-19.png');
    img.width = 20;
    img.height = 20;
    img.border = 0;
    img.align = 'top';
    img.className = 'wikiWidgetAction highlightableIcon';
    anchor.appendChild(img);

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      readlater(item.dataset.alternateLink);
      port.postMessage({site: 'Feedly'});
    }, true);

    var position = item.querySelector('.viewerIcon');
    position.parentNode.insertBefore(anchor, position);
  };

  for (var i = 0; i < feed.length; i++) {
    applyFeed(feed[i]);
  }

  for (var i = 0; i < all.length; i++) {
    applyAll(all[i]);
  }
}

if (location.hostname == 'cloud.feedly.com') {
  observer(feedly, {subtree: true, childList: true});
}
