(function () {
  if (window.location.host !== 'y.qq.com')
    return;
  var now = new Date().getTime();
  var lastSetTime = Number(localStorage.getItem('soso-music-cookie'));
  // 强制刷新 cookie 请求
  if (window.location.href.indexOf('forceUpdateCookie') > 0) {
    localStorage.setItem('soso-music-cookie', '0');
  }
  // 24小时以内的就先不发送了
  if (lastSetTime + 3600000 * 24 > now) {
    return;
  }

  function Toast() {
    var toastDom = $('<div id="soso-music-cookie-toast"><div class="content"></div></div>');
    $('body').append(toastDom);
    this.hideToastTime = new Date().getTime();
    var that = this;
    this.hide = function () {
      that.hideToastTime = new Date().getTime();
      toastDom.fadeOut();
    };
    this.show = function (text, expireTime) {
      expireTime = expireTime || 3000;
      that.hideToastTime = new Date().getTime() + expireTime;
      toastDom.find('.content').text(text);
      toastDom.fadeIn();
      setTimeout(that.hide, expireTime);
    };
    return this;
  }

  var toast = new Toast();

  var cookie = document.cookie;
  var quin = document.cookie.match(/\suin=(\d+);/);
  if (quin) {
    quin = quin[1];
  } else {
    return;
  }
  if (cookie.indexOf('qm_keyst') < 0) {
    toast.show('未登陆企鹅号', 5000);
  } else {
    $.post({
      url: 'https://api.qq.jsososo.com/user/setCookie',
      data: JSON.stringify({
        data: document.cookie,
      }),
      contentType: 'application/json',
      success(res) {
        localStorage.setItem('soso-music-cookie', String(now));
        toast.show('发送成功，2s后自动跳转！');
        setTimeout(function () {
          window.location = ('http://music.jsososo.com?q=' + quin);
        }, 2000);
      },
      error(res) {
        console.log(res, 'error')
      }
    })
  }

  // alert(document.cookie);

})();