/**
 * Add yuehu button on digg.com/reader
 */


function digg(mutations) {

  var items = [];
  mutations.forEach(function(mu) {
    if (mu.target) {
      var entries = mu.target.querySelectorAll('.feeditem-list');
      for (var i = 0; i < entries.length; i++) {
        var item = entries[i];
        if (item && item.querySelector) {
          items.push(item);
        }
      }
    }
  });

  var createIcon = function(item) {
    if (item.querySelector('.story-action-yuehu')) {
      return;
    }

    var anchor = document.createElement('a');
    anchor.href = '#';
    anchor.title = i18n('name');
    anchor.style.backgroundImage = 'url(' + chrome.extension.getURL('/icons/icon-inactive-19.png') + ')';

    var li = document.createElement('li');

    item.addEventListener('click', function(e) {
      if (e.target === anchor || e.target === li) {
        e.preventDefault();
        readlater(item.querySelector('.timestamp').href);
        port.postMessage({site: 'Digg'});
      }
    }, true);

    var position = item.querySelector('.story-action-item');

    li.className = 'story-action-item story-action story-action-yuehu';
    li.appendChild(anchor);
    position.parentNode.insertBefore(li, position);
  };

  for (var i = 0; i < items.length; i++) {
    createIcon(items[i]);
  }

}

if (/^https?:\/\/digg\.com\/reader/.test(location.href)) {
  observer(digg, {subtree: true, childList: true});
}
