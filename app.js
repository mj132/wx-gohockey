//app.js
import WxValidate from 'utils/wxvalidate'
App({
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  onLaunch: function () {
    var that = this;
    wx.setStorageSync('sysinfo', wx.getSystemInfoSync());
    console.log(wx.getSystemInfoSync())
    // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//             wx.getUserInfo({
//                 success: res => {
//                     // 可以将 res 发送给后台解码出 unionId
//                     this.globalData.userInfo = res.userInfo

//                     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//                     // 所以此处加入 callback 以防止这种情况
//                     if (this.userInfoReadyCallback) {
//                         this.userInfoReadyCallback(res)
//                     }
//                 }
//             })
//         }
//       }
//     })

   
  },

  getCode: function (cb) {
       wx.login({
            success: function (res) {
                 wx.request({
                      url: 'https://xiaochengxu.gogohockey.com/api/get_openid',
                      data: {
                           action: 'get_openid',
                           code: res.code
                      },
                      success: function (res) {
                           if (res.data.status != 1) {
                                wx.showModal({
                                     title: '出错啦',
                                     content: '登录出现错误',
                                })
                           } else {
                                console.error(res);
                                var id = res.data.data;
                                typeof cb == "function" && cb(id);
                           }
                      }
                 })
            }
       })
  },
  login: function (userinfo, cb) {
       var isEn = wx.getSystemInfoSync().language == 'zh_CN';
       console.log('isEen'+isEn);
       if (userinfo.userInfo) {
            wx.showLoading({
                 title: isEn ? '登陆中...' : 'Login...' ,
            })
       } else {
            wx.showToast({
                 title: isEn ?  '登录失败' : 'Login Failed',
                 image: '../../image/fail.png'
            });
            return;
       }
       var iv = userinfo.iv;
       var encryptedData = userinfo.encryptedData;
       console.log(iv)
       console.log(encryptedData)
       this.getCode(function (res) {
            if (res) {
                console.log("https://xiaochengxu.gogohockey.com/api/userinfo?id=" + res + "&action=userinfo&encryptedData=" + encryptedData+"&iv="+iv);
                 wx.request({
                      url: 'https://xiaochengxu.gogohockey.com/api/userinfo',
                      header: {
                           "content-type": "application/x-www-form-urlencoded"
                      },
                      method: 'POST',
                      data: {
                           action: 'userinfo',
                           encryptedData: decodeURIComponent(encryptedData),
                           iv: decodeURIComponent(iv),
                           id: res,
                      },
                      success: function (res) {
                          var data = res.data;
                          data = data.replace(/\s/g, '');
                          data = JSON.parse(data);
                           console.log(data);
                           if(data.status == 1){
                               data = data.data;
                               var userIdAndToken = data;
                               userIdAndToken.user_id = data.id;
                               wx.setStorageSync("userIdAndToken", userIdAndToken);
                               wx.showToast({
                                   title: isEn ? '登录成功' : 'Success!',
                               });
                               typeof cb == 'function' && cb("ok");
                           }else{
                               wx.showModal({
                                   title: isEn ? '提示' : 'Error',
                                   content: isEn ? '登录失败，请重试' : 'Log in failed,retry please',
                                   confirmText: isEn ? '确定' : 'Confirm',
                                   showCancel: false
                               });
                               typeof cb == 'function' && cb("fail");
                           }
                      }
                 })
            }
       })
  },


  globalData: {
    userInfo: null,
    user_id: null,
    _token: null,
    isiphx: false,
    language: true,
    api: "https://xiaochengxu.gogohockey.com",
    res: "https://xiaochengxu.gogohockey.com/img/"
  },
  onShow: function() {
      var that = this;
      wx.getSystemInfo({
          success: function(res) {
              console.log(res.model)  
             var iphx  = res.model;
              if (iphx.indexOf('iPhone X') != -1) {
                  that.globalData.isiphx = true
              }

          }
      })  
  }
})