(function () {
  if (window.location.host !== 'y.qq.com')
    return;

  var cookieObj = {};
  document.cookie.split(';').forEach(function (str) {
    var keyArr = str.split('=');
    cookieObj[keyArr[0].replace(/\s/g, '')] = keyArr[1];
  })
  if (Number(cookieObj.login_type) === 2) {
    cookieObj.uin = cookieObj.wxuin;
  }
  cookieObj.uin = (cookieObj.uin || '').replace(/\D/g, '');


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
    this.changeTxt = function (text) {
      toastDom.find('.content').text(text);
    }
    return this;
  }

  function Dialog() {
    var autoJump = Number(localStorage.getItem('soso-music-auto-jump'));
    var dialogDom = $(
      '<div class="popup_guide soso-popup" style="z-index: 1002;">' +
      '  <div class="dialog-content">' +
      '    <div class="soso-popup-title">cookie 搬运工！</div>' +
      '    <div class="soso-popup-uin"><span class="login-type">QQ </span> <input type="text" style="width:100px" /></div>' +
      '    <div><input id="soso-music-cookie-input" type="text" readonly></div>' +
      '    <div><button class="copy-cookie" style="margin-right: 10px;">复制</button><button class="jump-cookie">跳转</button></div>' +
      '    <div><div class="checkbox-check so-auto-jump ' + (autoJump ? 'checked' : '') + '"></div><span class="so-auto-jump" style="padding-left: 10px">重登后自动跳转</span></div>' +
      '  </div>' +
      '</div>'
    );
    $('body').append(dialogDom);
    dialogDom.find('#soso-music-cookie-input').val(document.cookie);
    console.log(cookieObj);
    if (cookieObj.uin) {
      dialogDom.find('.soso-popup-uin .login-type').html((Number(cookieObj.login_type) === 2 ? 'wxuin' : 'QQ'));
      dialogDom.find('.soso-popup-uin input').val(cookieObj.uin)
    }
    this.dom = dialogDom;

    return this;
  }

  function jump() {
    $.post({
      url: 'https://api.qq.jsososo.com/user/setCookie',
      data: JSON.stringify({
        data: document.cookie,
      }),
      contentType: 'application/json',
      success(res) {
        toast.show('发送成功，2s后自动跳转！');
        setTimeout(function () {
          toast.changeTxt('发送成功，1s后自动跳转！')
        }, 1000);
        setTimeout(function () {
          window.location = ('http://music.jsososo.com?q=' + quin);
        }, 2000);
      },
      error(res) {
        console.log(res, 'error')
      }
    })
  }

  var toast = new Toast();
  var dialog = new Dialog();

  dialog.dom.on('click', '.copy-cookie', function (e) {
    var input = $('#soso-music-cookie-input')[0];
    input.select();
    document.execCommand("Copy");
    toast.show('复制成功!');
  })

  dialog.dom.on('click', '.jump-cookie', jump);

  dialog.dom.on('click', '.so-auto-jump', function () {
    var autoJump = Number(localStorage.getItem('soso-music-auto-jump'));

    if (autoJump) {
      $('.checkbox-check.so-auto-jump').removeClass('checked');
    } else {
      $('.checkbox-check.so-auto-jump').addClass('checked');
    }
    localStorage.setItem('soso-music-auto-jump', Number(!Number(autoJump)));
  })

  var quin = cookieObj.uin;
  if (!quin) {
    localStorage.setItem('soso-music-cookie-login', '0');
    return toast.show('未登陆账号', 5000);
  }
  if (!cookieObj.qm_keyst) {
    toast.show('未登陆账号', 5000);
    localStorage.setItem('soso-music-cookie-login', '0');
  } else {
    var isLogin = Number(localStorage.getItem('soso-music-cookie-login'));
    var autoJump = Number(localStorage.getItem('soso-music-auto-jump'));
    if (!isLogin && autoJump) {
      jump();
    }
    localStorage.setItem('soso-music-cookie-login', '1');
  }

})();