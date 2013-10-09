/**
 * Loading site scripts.
 */

if (location.hostname == 'yuehu.me') {
  execSite('yuehu');
} else if (/www\.zhihu\.com\/question\/\d+/.test(location.href)) {
  execSite('zhihu');
} else if (/^https?:\/\/digg\.com\/reader/.test(location.href)) {
  execSite('digg');
} else if (location.hostname == 'cloud.feedly.com') {
  execSite('feedly');
}
