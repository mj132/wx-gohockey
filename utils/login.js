function userLogin(fun1, scene, options) {
  var userIdAndToken = wx.getStorageSync("userIdAndToken");
 
  if (!userIdAndToken) {
    wx.showLoading({
      title: '登录中',
      mask:true
    })
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          wx.request({
            url: 'https://xiaochengxu.hongluoshanfang.com/api/get_code',
            data: { action: 'get_openid', code: res.code },
            success: function (data) {
              console.log(data)
              wx.hideLoading();
              if (data.data.status!=1){
                wx.showModal({
                  title: '登录出错啦~请重试，或与我们联系',
                  content: '',
                  showCancel:false
                })
                return;
              }
              var id = data.data.data;
              wx.getUserInfo({
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '登陆中',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                  })
                  var encryptedData = res.encryptedData
                  // console.log(encryptedData)
                  var iv = res.iv
                  // console.log(iv)
                  var invite_by_id = wx.getStorageSync('invite_by_id');
                  invite_by_id = invite_by_id ? invite_by_id:'';
                  console.log('invite_by_id=' + invite_by_id);
                  scene = wx.getStorageSync('platform_number') ? wx.getStorageSync('platform_number') : scene
                  wx.request({
                    url: 'https://xiaochengxu.hongluoshanfang.com/api/userinfo',
                    header: { "content-type": "application/x-www-form-urlencoded" },
                    method: 'POST',
                    data: { action: 'userinfo', encryptedData: encryptedData, iv: iv, id: id, invite: invite_by_id, platform_number: scene},
                    success: function (res) {
                      // console.log('f')
                      var str = res.data;
                      wx.hideToast();
                      str = str.replace(/\s/g, '');
                      var a = JSON.parse(str);
                      // console.log(a)
                      var user_id = a.data.id;
                      var platform_number =a.data.platform_number;
                      var _token = a.data._token, mobile = a.data.mobile;
                      // 获取邀请链接参数
                      wx.request({
                        url: 'https://xiaochengxu.hongluoshanfang.com/api/get_my_invite',
                        data: { action: 'get_my_invite', user_id: user_id, _token: _token},
                        success:function(da){
                          if(da.data.status==1){
                            wx.setStorageSync('invite', da.data.data);
                            console.log('invite='+da.data.data)
                          }


                        }
                      })







                      
                      wx.setStorageSync('userIdAndToken', { user_id: user_id, _token: _token});
                      wx.setStorageSync('platform_number', platform_number)
                      wx.setStorageSync('mobile', mobile);
                      typeof fun1 == 'function' && fun1(options);

                    }
                  })
                }, fail: function (res) {
                  wx.showModal({
                    title: '警告',
                    content: '若不授权微信登录，则无法使用亿员健康功能;点击重新获取授权则可重新使用;若点击不授权，后期还使用小程序，需在微信【发现】——【小程序】——删掉【亿员健康】，重新搜索授权登录，方可使用',
                    cancelText: '不授权',
                    confirmText: "授权",
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: function (res) {
                            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                              //这里是授权成功之后 填写你重新获取数据的js
                              userLogin(fun1, scene, options)
                            }
                          }
                        })

                      }
                    }
                  })



                }
              })

            }
          })
        }
      }, fail: function (res) {
        console.log(res)
      }

    })

    // wx.request({
    //   url: 'https://xiaochengxu.hongluoshanfang.com/api/userinfo',
    // })
  } else {
    
      wx.request({
        url: 'https://xiaochengxu.hongluoshanfang.com/api/get_userinfo',
        data: { action: 'get_userinfo', _token: userIdAndToken['_token'], user_id: userIdAndToken       ['user_id'], },
        success: function (res) {
          if(res.data.code==1001){
            wx.removeStorageSync('userIdAndToken');
            // var a=fun1
            userLogin(fun1, scene, options)
          }else{
            typeof fun1 == 'function' && fun1(options);
          }
        }
      })
  }
}


module.exports = {
  userLogin: userLogin
}
