// pages/signup/signup.js
const app = getApp()
var util = require('../../utils/util.js');
const lang = app.globalData.language;
const api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: true,
    sexs: [
      {id: 1,en_name: 'male',name: '男'},
      {id: 2,en_name: 'female',name: '女'}
    ],
    toggle: true,
    read: true,
    hindex: 3,
    windex: 6,
    sindex: 4,
    gender: 1,
    height: [190,185,180,175,170,165,160,155,150,145,140],
    weight: ['100kg', '95kg', '90kg', '85kg', '80kg', '75kg', '70kg', '65kg', '60kg', '55kg','50kg', '45kg', '40kg'],
    shoesize: [46,45,44,43,42,41,40,39,38,37,36,35,34],
    h_curr: 175,
    w_curr: '70kg',
    s_curr: 42
  },
  //切换
  toggleneed: function() {
       var that = this;
    var t = !that.data.toggle;
    this.setData({
      toggle: t
    })
  },
  togread: function() {
       var that = this;
    var r = !that.data.read;
    this.setData({
      read: r
    })
  },
//   安全协议
pop: function() {
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

  //下拉框选择
  heightChange: function(e){
       var that = this;
    var index = e.detail.value;
    this.setData({
      hindex: index,
      h_curr: that.data.height[index]
    })
  },
  weightChange: function (e) {
       var that = this;
    var index = e.detail.value;
    this.setData({
      windex: index,
      w_curr: that.data.weight[index]
    })
  },
  sizeChange: function (e) {
       var that = this;
    var index = e.detail.value;
    this.setData({
      sindex: index,
      s_curr: that.data.shoesize[index]
    })
  },
  radioChange: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  // 表单提交
  formSubmit: function (e) {
       var that = this;
       var lang = that.data.language;
       that.isBookingInOneTime(function(res, that){
            if(res == 1){
                 console.log(res)
                 wx.showModal({
                      title: lang ? '提示' : 'Hint',
                      content: lang ? '您已订购同时段课程' : 'You have ordered the same period of classes',
                      showCancel: false,
                      success: function(res){
                           return;
                      }
                 });
                 return;
            }else{

                      
                 console.log(that)
                 const lang = that.data.language;
                 var user = wx.getStorageSync("userIdAndToken");
                 if (!user) {
                      wx.showModal({
                           title: lang ? '你还没有登录' : 'Please Log In First',
                           showCancel: false
                      })
                      return false;
                 }
                 var user = wx.getStorageSync("userIdAndToken");
                 var formId = e.detail.formId;
                 console.log(e)
                 //提交错误描述
                 if (!that.WxValidate.checkForm(e)) {
                      const error = that.WxValidate.errorList[0]
                      // `${error.param} : ${error.msg} `
                      wx.showModal({
                           title: `${error.msg} `,
                           showCancel: false
                      })
                      return false
                 }

                 //判断安全协议
                 if (!that.data.read) {
                      wx.showModal({
                           title: lang ? '请阅读安全协议' : 'Please read the safety contract',
                           showCancel: false
                      })
                      return false;
                 }

                 var card = e.detail.value.card || e.detail.value.passport;
                 //获取余额
                 wx.request({
                      url: 'https://xiaochengxu.gogohockey.com/api/get_user_card',
                      data: {
                           action: 'get_user_card',
                           user_id: user['user_id'],
                           _token: user['_token'],
                           page: 1
                      },
                      success: function (res) {
                           var balance = res.data.balance ? res.data.balance : 0;

                           //是否有护具
                           if (that.data.toggle) {
                                if (that.data.course.if_exp == 0) {
                                     //判断余额够不够
                                     if (balance <= 0) {
                                        
                                          var item = lang ? ['单次购买', '购买次卡更优惠'] : ['Single Payment', 'Buy Pass for Discount'];
                                          wx.showActionSheet({
                                               itemList: item,
                                               success: function (res) {
                                                    if (res.tapIndex == 0) {
                                                         wx.request({
                                                              url: 'https://xiaochengxu.gogohockey.com/api/booking_card',
                                                              data: {
                                                                   action: 'booking',
                                                                   id: that.data.course_id,
                                                                   time_id: that.data.time_id,
                                                                   user_id: user['user_id'],
                                                                   _token: user['_token'],
                                                                   form_id: e.detail.formId,
                                                                   date: that.data.myDate,
                                                                   realname: e.detail.value.name,
                                                                   mobile: e.detail.value.mobile,
                                                                   id_number: card,
                                                                   gender: that.data.gender,
                                                                   if_equipment: 0,
                                                                   shose: that.data.s_curr,
                                                                   height: that.data.h_curr,
                                                                   weight: that.data.w_curr,
                                                                   remark: e.detail.value.remark,
                                                                   type: 2
                                                              },
                                                              method: 'POST',
                                                              header: {
                                                                   "Content-Type": "application/x-www-form-urlencoded"
                                                              },
                                                              success: function (res) {
                                                                   console.log(res.data)
                                                                   if (res.data.status == 1 && res.data.params) {
                                                                        var params = res.data.params;
                                                                        wx.hideLoading();
                                                                        wx.requestPayment({
                                                                             timeStamp: params.timeStamp,
                                                                             nonceStr: params.nonceStr,
                                                                             package: params.package,
                                                                             signType: params.signType,
                                                                             paySign: params.sign,
                                                                             success: function (res) {
                                                                                  wx.reLaunch({
                                                                                       url: '../pay/success/success'
                                                                                  })
                                                                             },
                                                                             fail: function (res) {
                                                                                  wx.showToast({
                                                                                       title: '支付失败',
                                                                                  })
                                                                             }
                                                                        })

                                                                   }
                                                              },
                                                              fail: function () {
                                                              },
                                                              complete: function () {
                                                              }
                                                         })
                                                    } else if (res.tapIndex == 1) {
                                                         wx.navigateTo({
                                                              url: '../recharge/select/select'
                                                         })
                                                    } else {
                                                         console.log('User Canceled')
                                                    }
                                               }
                                          });
                                          return;
                                     }
                                     var totalPrice = parseInt(that.data.course.price) + 30;
                                } else {
                                     that.isBookingExp(function (res) {
                                          if (res == 1) {
                                               wx.showModal({
                                                    title: lang ? '提示' : 'Hint',
                                                    content: lang ? '体验课只能购买一次' : 'The experience class can only be bought once',
                                                    showCancel: false,
                                                    success: function (res) {
                                                         return;
                                                    }
                                               });
                                               return;
                                          }
                                     });
                                     var totalPrice = parseInt(that.data.course.price);
                                }
                                if (that.data.language) {
                                     var prompt = that.data.course.price == '0.00' ? '确认购买' : ' 当前次卡数：' + balance + ', 确认使用1次？';
                                     var modalTitle = '下单提醒';
                                     var confirm = '确定';
                                     var cancel = '取消';
                                     var wait = '等待确定中';
                                } else {
                                     var prompt = that.data.course.price == '0.00' ? ' You will cost 0 yuan to buy this class' : ' Left times：' + balance + ', use 1 times now?';
                                     var modalTitle =  'Order confirm';
                                     var confirm = 'Confirm';
                                     var cancel = 'Cancel';
                                     var wait = 'Waiting for confirmation';
                                }
                                // 询问是否支付
                                wx.showModal({
                                     title: modalTitle,
                                     content: prompt,
                                     confirmText: confirm,
                                     cancelText: cancel,
                                     success: function (res) {
                                          if (res.cancel) {
                                               return false;
                                          }
                                          if (res.confirm) {
                                               wx.showLoading({
                                                    title: wait,
                                                    mask: true
                                               })
                                               //提交
                                               wx.request({
                                                    url: 'https://xiaochengxu.gogohockey.com/api/booking_card',
                                                    data: {
                                                         action: 'booking',
                                                         id: that.data.course_id,
                                                         time_id: that.data.time_id,
                                                         user_id: user['user_id'],
                                                         _token: user['_token'],
                                                         form_id: e.detail.formId,
                                                         date: that.data.myDate,
                                                         realname: e.detail.value.name,
                                                         mobile: e.detail.value.mobile,
                                                         id_number: card,
                                                         gender: that.data.gender,
                                                         if_equipment: 0,
                                                         shose: that.data.s_curr,
                                                         height: that.data.h_curr,
                                                         weight: that.data.w_curr,
                                                         remark: e.detail.value.remark,
                                                         type: that.data.course.price == '0.00' ? 2 : 1
                                                    },
                                                    method: 'POST',
                                                    header: {
                                                         "Content-Type": "application/x-www-form-urlencoded"
                                                    },
                                                    success: function (res) {
                                                         console.log(res.data)
                                                         if (res.data.status == 1) {
                                                              wx.hideLoading();
                                                              wx.reLaunch({
                                                                   url: '../pay/success/success'
                                                              })
                                                         }
                                                    },
                                                    fail: function () {
                                                    },
                                                    complete: function () {
                                                    }
                                               })
                                          }
                                     }
                                })
                           } else {
                                if (that.data.course.if_exp == 0) {
                                     //判断余额够不够
                                     if (balance <= 0) {
                                          var item = lang ? ['单次购买', '购买次卡更优惠'] : ['Single Payment', 'Buy Pass for Discount'];
                                          wx.showActionSheet({
                                               itemList: item,
                                               success: function (res) {
                                                    if (res.tapIndex == 0) {
                                                         wx.request({
                                                              url: 'https://xiaochengxu.gogohockey.com/api/booking_card',
                                                              data: {
                                                                   action: 'booking',
                                                                   id: that.data.course_id,
                                                                   time_id: that.data.time_id,
                                                                   user_id: user['user_id'],
                                                                   _token: user['_token'],
                                                                   form_id: e.detail.formId,
                                                                   date: that.data.myDate,
                                                                   realname: e.detail.value.name,
                                                                   mobile: e.detail.value.mobile,
                                                                   id_number: card,
                                                                   gender: that.data.gender,
                                                                   if_equipment: 1,
                                                                   shose: that.data.s_curr,
                                                                   height: that.data.h_curr,
                                                                   weight: that.data.w_curr,
                                                                   remark: e.detail.value.remark,
                                                                   type: 2
                                                              },
                                                              method: 'POST',
                                                              header: {
                                                                   "Content-Type": "application/x-www-form-urlencoded"
                                                              },
                                                              success: function (res) {
                                                                   console.log(res.data)
                                                                   if (res.data.status == 1 && res.data.params) {
                                                                        var params = res.data.params;
                                                                        wx.hideLoading();
                                                                        wx.requestPayment({
                                                                             timeStamp: params.timeStamp,
                                                                             nonceStr: params.nonceStr,
                                                                             package: params.package,
                                                                             signType: params.signType,
                                                                             paySign: params.sign,
                                                                             success: function (res) {
                                                                                  wx.reLaunch({
                                                                                       url: '../pay/success/success'
                                                                                  })
                                                                             },
                                                                             fail: function (res) {
                                                                                  wx.showToast({
                                                                                       title: '支付失败',
                                                                                  })
                                                                             }
                                                                        })

                                                                   }
                                                              },
                                                              fail: function () {
                                                              },
                                                              complete: function () {
                                                              }
                                                         })
                                                    } else if (res.tapIndex == 1) {
                                                         wx.navigateTo({
                                                              url: '../recharge/select/select'
                                                         })
                                                    } else {
                                                         console.log('User Canceled')
                                                    }
                                               }
                                          });
                                          return false;
                                     }
                                }else{
                                     that.isBookingExp(function (res) {
                                          if (res == 1) {
                                               wx.showModal({
                                                    title: lang ? '提示' : 'Hint',
                                                    content: lang ? '体验课只能购买一次' : 'The experience class can only be bought once',
                                                    showCancel: false,
                                                    success: function (res) {
                                                         return;
                                                    }
                                               });
                                               return;
                                          }
                                     });
                                }
                                
                                var totalPrice = parseInt(that.data.course.price);
                                if (that.data.language) {
                                     var prompt = that.data.course.price == '0.00' ? '确认购买' : ' 当前次卡数：' + balance + ', 确认使用1次？';
                                     var modalTitle = '下单提醒';
                                     var confirm = '确定';
                                     var cancel = '取消';
                                     var wait = '等待确定中';
                                } else {
                                     var prompt = that.data.course.price == '0.00' ? ' You will cost 0 yuan to buy this class' : ' Left times：' + balance + ', use 1 times now?';
                                     var modalTitle = 'Order confirm'
                                     var confirm = 'Confirm';
                                     var cancel = 'Cancel';
                                     var wait = 'Waiting for confirmation';
                                }
                                // 询问是否支付
                                wx.showModal({
                                     title: modalTitle,
                                     content: prompt,
                                     confirmText: confirm,
                                     cancelText: cancel,
                                     success: function (res) {
                                          if (res.cancel) {
                                               return false;
                                          }
                                          if (res.confirm) {
                                               wx.showLoading({
                                                    title: wait,
                                                    mask: true
                                               })
                                               //提交
                                               wx.request({
                                                    url: 'https://xiaochengxu.gogohockey.com/api/booking_card',
                                                    data: {
                                                         action: 'booking',
                                                         id: that.data.course_id,
                                                         time_id: that.data.time_id,
                                                         user_id: user['user_id'],
                                                         _token: user['_token'],
                                                         form_id: formId,
                                                         date: that.data.myDate,
                                                         realname: e.detail.value.name,
                                                         mobile: e.detail.value.mobile,
                                                         id_number: card,
                                                         gender: that.data.gender,
                                                         if_equipment: 1,
                                                         type: that.data.course.price == '0.00' ? 2 : 1
                                                    },
                                                    method: 'POST',
                                                    header: {
                                                         "Content-Type": "application/x-www-form-urlencoded"
                                                    },
                                                    success: function (res) {
                                                         if (res.data.status == 1) {
                                                              wx.hideLoading();
                                                              wx.reLaunch({
                                                                   url: '../pay/success/success'
                                                              })
                                                         }
                                                    },
                                                    fail: function () {
                                                    },
                                                    complete: function () {
                                                    }
                                               })
                                          }
                                     }
                                })
                           }
                      }
                 })
            }
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       const lang = app.globalData.language;
       var user = wx.getStorageSync('userIdAndToken');
       if (!user || !user.mobile) {
            wx.redirectTo({
                 url: '../index/index',
            });
            return;
       }
       
      var user = wx.getStorageSync("userIdAndToken");
    this.setData({
      language: app.globalData.language
    })
    //用户最近一次报名信息
    wx.request({
        url: 'https://xiaochengxu.gogohockey.com/api/get_latest_booking',
        data: {
            action: 'get_latest_booking',
            user_id: user['user_id'],
            _token: user['_token']
        },
        success: function (res) {
            console.log(res.data)

            if(res.data.status){
                var d = res.data.data;
                that.setData({
                    name: d.realname,
                    mobile: d.mobile,
                    gender: d.gender
                })

                if (app.globalData.language){
                    that.setData({
                        card: d.id_number
                    })
                }else{
                    that.setData({
                        passport: d.id_number
                    })
                }

                if(d.if_equipment == 0){
                    var hindex = null;
                    var windex = null;
                    var sindex = null;
                    that.data.height.filter(function(item,index){
                        if(item == d.height){
                            hindex = index;
                            return false;
                        }
                    })

                    
                    that.data.weight.filter(function (item, index) {
                        if (item == d.weight) {
                            windex = index;
                            return false;
                        }
                    })

                    
                    that.data.shoesize.filter(function (item, index) {
                        if (item == d.shose) {
                           sindex = index;
                           return false;
                        }
                    })

                    that.setData({
                        hindex: hindex,
                        windex: windex,
                        sindex: sindex,
                        h_curr: d.height,
                        w_curr: d.weight,
                        s_curr: d.shose,
                        remark: d.remark
                    })
                }
                
            }
        }
    })
    
    
    //获取课程id
    var that = this;
    var course_id = options.id;
    var time_id = options.timeid;
    var date = options.date;
    this.setData({
      course_id: course_id,
      time_id: time_id,
      myDate: date
    })

    //获取对应id课程信息
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_course_detail',
      data: {
        action: 'get_course_detail',
        id: course_id,
        time_id: time_id,
        date: date,
        user_id: user['user_id'],
        _token: user['_token']
      },
      success: function (res) {
        console.log(res.data.data)
        
        that.setData({
          course: res.data.data
        })
        
      }
    })

    // 有身份证
    if (app.globalData.language){
      that.WxValidate = app.WxValidate(
        {
          name: {
            required: true,
            minlength: 2,
            maxlength: 20,
          },
          mobile: {
            required: true,
            tel: true,
          },
          card: {
            required: true,
            // idcard: true
          }
        }
        , {
          name: {
               required: lang ? '请填写您的姓名' : 'Please fill in your name',
          },
          mobile: {
            required: lang ? '请填写您的手机号' : 'Please fill in your phone no',
          },
          card: {
            required: lang ? '请填写您的身份证号' : 'Please fille in your passport no',
          }
        }
      );
    }else{
      that.WxValidate = app.WxValidate(
        {
          name: {
            required: true,
            minlength: 2,
            maxlength: 20,
          },
          mobile: {
            required: true,
            tel: true,
          },
          passport: {
            required: true,
            passport: true,
          }
        }
        , {
             name: {
                  required: lang ? '请填写您的姓名' : 'Please fill in your name',
             },
             mobile: {
                  required: lang ? '请填写您的手机号' : 'Please fill in your phone no',
             },
             card: {
                  required: lang ? '请填写您的护照' : 'Please fille in your passport no',
             }
        }
      );
      // 护照验证规则
    //   that.WxValidate.addMethod('passport', (value, param) => {
    //     return that.WxValidate.optional(value) || /^[0-9a-zA-Z]{9}$/.test(value)
    //   }, '请输入9位的有效护照')
    }
    //表单验证
    
    
    if (app.globalData.userInfo) {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
        })
    } else if (that.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
    } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

//   检测同一时段是否有别的课程
isBookingInOneTime: function(cb){
     var that = this;
     var auth = wx.getStorageSync('userIdAndToken');
     wx.request({
          url: api + '/api/check_booking',
          data: {
               action: "check_booking",
               user_id: auth.id,
               course_id: that.data.course_id,
               time_id: that.data.time_id,
               book_date: that.data.myDate
          },
          success: function(res){
               
               if(res.data.status == 1){
                    typeof cb == 'function' && cb('1', that);
               }else{
                    typeof cb == 'function' && cb('0', that);
               }
          }
     })
},
     isBookingExp: function (cb) {
          var that = this;
          var auth = wx.getStorageSync('userIdAndToken');
          wx.request({
               url: api + '/api/check_user_exp',
               data: {
                    action: "check_user_exp",
                    user_id: auth.id,
                    course_id: that.data.course_id,
                    time_id: that.data.time_id,
                    book_date: that.data.myDate
               },
               success: function (res) {
                    if (res.data.status == 1) {
                         typeof cb == 'function' && cb('1', that);
                    } else {
                         typeof cb == 'function' && cb('0', that);
                    }
               }
          })
     }
})