/**
 * Add yuehu button on www.zhihu.com
 */
var ZHIHU_PATTERN = /www\.zhihu\.com\/question\/\d+/;
function zhihu() {
  var m = location.href.match(/www\.zhihu\.com\/question\/(\d+)/);
  if (!m) return;

  var question = m[1];

  var items = document.querySelectorAll('.zm-item-answer');

  var createIcon = function(item) {
    var token = item.dataset.atoken;
    if (!token || len(item.innerText) < 200) {
      return;
    }
    if (item.querySelector('.meta-yuehu')) {
      return;
    }

    var anchor = document.createElement('a');
    anchor.href = 'javascript:;';
    anchor.className = 'meta-item meta-yuehu';
    anchor.innerHTML = '<i class="z-icon-collect"></i>' + i18n('name');

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      readlater('http://www.zhihu.com/question/' + question + '/answer/' + token);
    }, false);
    var position = item.querySelector('.zu-autohide');
    position.parentNode.insertBefore(anchor, position);
  };

  for (var i = 0; i < items.length; i++) {
    createIcon(items[i]);
  }
}
if (ZHIHU_PATTERN.test(location.href)) {
  observer(zhihu, {childList: true});
}
