//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    rink_id: 1,
    cityid: 1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    language: true,
    if_first: false,
    read: true,
    next: false,
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: false,
    auth: wx.getStorageSync('userIdAndToken'),
    api: app.globalData.api,
    lang: wx.getStorageSync('sysinfo').language == 'zh_CN',
    isiphx: app.globalData.isiphx
  },
  //   安全协议
  pop: function () {
      // wx.showModal({
      //     title: '安全协议',
      //     content: '（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）\r\n123456',
      //     showCancel: false,
      //     confirmText: '我知道了',
      //     success: function (res) {
      //         if (res.confirm) {

      //         } else if (res.cancel) {

      //         }
      //     }
      // })
  },
  mobile: function (e) {
      this.mobile_num = e.detail.value
  },
  //重发验证码
  repeatcode: function(){
      var that = this;
      var user = wx.getStorageSync("userIdAndToken");
      wx.request({
          url: 'https://xiaochengxu.gogohockey.com/api/send_mobile_code',
          data: {
              action: 'send_mobile_code',
              user_id: user['user_id'],
              _token: user['_token'],
              mobile: this.mobile_num,
              'type': 'login'
          },
          success: function (res) {
              // console.log(res)
              if (res.data.status == 1) {
                  // 跳转到验证码填写
                  that.setData({
                      next: true
                  })

                  // 倒计时
                  that.setData({
                      click_one: 60
                  })
                  var s = setInterval(function () {
                      if (that.data.click_one - 1 < 0) {
                          clearInterval(s);
                          that.setData({
                              click_one: ''
                          })
                      }
                      // console.log(e)
                      that.data.click_one - 1 >= 0 && that.setData({
                          click_one: --that.data.click_one
                      })
                  }, 1000)
              }

          }
      })
  },
  //验证码输入框
  Focus(e) {
      var that = this;
      var user = wx.getStorageSync("userIdAndToken");
    //   console.log(e.detail.value);
      var inputValue = e.detail.value;
      const lang = that.data.language;
      that.setData({
          Value: inputValue
      })
      if(inputValue.length == that.data.Length){
          wx.request({
              url: 'https://xiaochengxu.gogohockey.com/api/check_msg_code',
              data: {
                  action: 'check_msg_code',
                  user_id: user['user_id'],
                  _token: user['_token'],
                  mobile: that.mobile_num,
                  code: inputValue
              },
              success: function(res){
                //   console.log(res)
                if(res.data.status == 1){
                    
                    wx.request({
                        url: 'https://xiaochengxu.gogohockey.com/api/update_userinfo',
                        data: { 
                            action: 'update_userinfo',
                            user_id: user['user_id'],
                            _token: user['_token'],
                            mobile: that.mobile_num
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                 user.mobile = that.mobile_num;
                                 wx.setStorageSync('userIdAndToken', user);
                                   that.setData({
                                        auth: user
                                   });
                                   wx.showToast({
                                        title: lang ? '绑定成功' : 'Success!',
                                   })
                              //    that.setData({
                              //        if_first: false
                              //    })
                            } else {
                                wx.showModal({
                                     title: lang ? '信息提交失败，请重试~' : 'Failure to submit, please try again ',
                                    showCancel: false
                                })
                            }
                        }
                    })
                }else{
                    wx.showModal({
                         title: lang ? '验证码输入不正确，请重试~' : 'The validation code input is incorrect, please try again',
                        showCancel: false
                    })
                }
              }
          })
      }
  },
  Tap() {
      var that = this;
      that.setData({
          isFocus: true,
      })
  },  
//   选择冰场
  selectRink: function(e) {
    this.setData({
      rink_id: e.currentTarget.dataset.id,
      cityid: e.currentTarget.dataset.cityid
    })
  },
  togread: function () {
      var r = !this.data.read;
      this.setData({
          read: r
      })
  },
//   下一步
  submit_tel: function () {
      //   wx.setStorageSync('if_first_tel',true);
      // this.setData({
      //   if_first_tel: true,
      // })
      var that = this;
      var read = this.data.read;
      var mobile_num = this.mobile_num;
      var user = wx.getStorageSync("userIdAndToken");
      var lang = wx.getStorageSync('sysinfo').language == 'zh_CN';
      if (!mobile_num) {
          wx.showModal({
              title: lang ? '请输入手机号码' : 'Please Input Your Phone Number',
              showCancel: false
          })
          return false;
      }
      if (!/0?(13|14|15|16|17|18|19)[0-9]{9}/.test(mobile_num)) {
          wx.showModal({
              title: lang ? '请输入正确的手机号码' : 'Phone Number Is Incorrect',
              showCancel: false
          })
          return false;

      }
      if (!read) {
          wx.showModal({
               title: lang ? '请同意安全协议' : 'Please Agree With The Security Agreement',
              showCancel: false
          })
          return false;
      }
      //检测手机号是否重复
      wx.request({
          url: "https://xiaochengxu.gogohockey.com/api/check_mobile",
          data: {
              action: 'check_user_mobile',
              user_id: user['user_id'],
              _token: user['_token'],
              mobile: mobile_num
          },
          success: function(res) {
          //     console.log(res.data)
              if(res.data.status == 1){
                  wx.showModal({
                       title: lang ? '此电话号码已存在' : 'This Phone Number Has Been Registered',
                      showCancel: false
                  })
                  return false;
              }else{
                  
                  //   不重复发送验证码
                  wx.request({
                      url: 'https://xiaochengxu.gogohockey.com/api/send_mobile_code',
                      data: {
                          action: 'send_mobile_code',
                          user_id: user['user_id'],
                          _token: user['_token'],
                          mobile: mobile_num,
                          'type': 'login'
                      },
                      success: function (res) {
                          // console.log(res)
                          if (res.data.status == 1) {
                              // 跳转到验证码填写
                              that.setData({
                                  next: true
                              })

                              // 倒计时
                              that.setData({
                                  click_one: 60
                              })
                              var s = setInterval(function () {
                                  if (that.data.click_one - 1 < 0) {
                                      clearInterval(s);
                                      that.setData({
                                          click_one: ''
                                      })
                                  }
                                  // console.log(e)
                                  that.data.click_one - 1 >= 0 && that.setData({
                                      click_one: --that.data.click_one
                                  })
                              }, 1000)
                          }else{
                               wx.showModal({
                                    title: lang ? '发送失败' : 'Failed ',
                                    content: lang ? '验证码发送失败！' : 'Verification code sending failed',
                               })
                          }

                      }
                  })
              }
          }
      })
  },
  gocourse: function(e) {
       var that = this;
       var lang = wx.getStorageSync('sysinfo').language == 'zh_CN';
    var spaceid = e.currentTarget.dataset.id;
    var cityid = e.currentTarget.dataset.cityid;
    var auth = wx.getStorageSync('userIdAndToken');
    if(auth && auth.mobile){
         wx.redirectTo({
              url: '../course/course?id=' + spaceid + '&cityid=' + cityid
         })
    }else{
         wx.showModal({
              title: lang ? '登录提醒' : 'Login',
              content: lang ? '请先登录' : 'Please Log In',
              showCancel: false,
              confirmText: lang ? '确定':'Confirm'
         })
    }
  },
  gomine: function () {
      wx.redirectTo({
          url: '../mine/mine'
      })
  },
  onLoad: function () {
      var that = this;
      var user = wx.getStorageSync("userIdAndToken");
      var lang = wx.getStorageSync('sysinfo').language == 'zh_CN';
      if(user && user.mobile && user.mobile.length >0){
           that.setData({
                if_first: false,
                lang: lang
           })
      }
    // 获取冰场
    var that = this;
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_index_space',
      data: { 'action': 'get_index_space', 'page': 1 },
      success: function(res) {
     //    console.log(res.data.data)
        that.setData({
          index_space: res.data.data
        })
      }
    })
  },
  getUserInfo: function(e) {
       var that = this;
    var userinfo = e.detail;
        
        app.login(userinfo, function(res){
             if(res == 'ok'){
                  that.setData({
                       auth: wx.getStorageSync('userIdAndToken')
                  });
                  wx.hideLoading();
             }else{
                 wx.hideLoading();
             }
        })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
