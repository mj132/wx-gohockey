// pages/mine/mine.js
const app = getApp()
const api = app.globalData.api;
const lang = app.globalData.language;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: 1,
    ranking: [1,2,3,4,5,6,7,8],
    language: true,
    api: api
  },
  // 充值
  gorecharge: function() {
    wx.navigateTo({
      url: '../recharge/select/select'
    })
  },
  //topbar跳转
  change_course: function(e) {
    var etype = e.currentTarget.dataset.type;
    this.setData({
      nav: etype
    })
  },
  change_ranking: function (e) {
    var etype = e.currentTarget.dataset.type;
    this.setData({
      nav: etype
    })
  },
  change_balance: function (e) {
    var etype = e.currentTarget.dataset.type;
    this.setData({
      nav: etype
    })
    var user = wx.getStorageSync("userIdAndToken");
    var that = this;
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
            console.log(res.data)
            var consume_list = res.data.data ? res.data.data : null;
            var balance = res.data.balance ? res.data.balance : 0;
            that.setData({
                consume_list: consume_list,
                balance: balance
            })
        }
    })
  },

  // 底部跳转事件处理函数
  gogohockey: function () {
    wx.redirectTo({
      url: '../gohockey/gohockey'
    })
  },
  gocourse: function () {
    wx.redirectTo({
      url: '../course/course'
    })
  },
  gomine: function(){
       var that = this;
       var auth = that.data.auth;
      if(auth && auth.mobile){
           wx.redirectTo({
                url: '../mine/mine'
           })
      }else{
           wx.redirectTo({
                url: '../index/index',
           })
      }
  },
  //取消课程
  cancelCourse: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("userIdAndToken");
    //确认取消
    wx.showModal({
         title: lang ? '你确认取消吗？' : 'Do you confirm the cancellation?',
         confirmText: lang ? "确认" : "confirm",
         showCancel: true,
      success: function(res){
        if(res.confirm){
          // 取消课程
          wx.request({
            url: 'https://xiaochengxu.gogohockey.com/api/cancel_booking',
            data: {
              id: id,
              action: 'cancel_booking',
              user_id: user['user_id'],
              _token: user['_token']
            },
            success: function (res) {
              // 获取约课
              wx.request({
                url: 'https://xiaochengxu.gogohockey.com/api/get_booking_list',
                data: {
                  action: 'get_booking_list',
                  user_id: user['user_id'],
                  _token: user['_token'],
                  page: 1
                },
                success: function (res) {
                  console.log(res.data.data)
                  var booking_list = res.data.data ? res.data.data : null;
                  //获取是否课程是否到期
                  if (booking_list) {
                    wx.getSystemInfo({
                      success: function (res) {
                        console.log(res.model)
                        var book_time = booking_list.map(function (item) {

                          if (res.model.indexOf("iPhone") != -1) {
                            var expire = that.data.iph_year + item.book_date.replace(/-/g, '/') + ' ' + item.book_time.split('-')[0];
                            expire = Date.parse(new Date(expire)) / 1000;
                            if (that.data.time + 5400 < expire) {
                              return true;
                            } else {
                              return false;
                            }
                          } else {
                            var expire = that.data.year + item.book_date + ' ' + item.book_time.split('-')[0];
                            expire = Date.parse(new Date(expire)) / 1000;
                            if (that.data.time + 5400 < expire) {
                              return true;
                            } else {
                              return false;
                            }
                          }
                        });

                        booking_list.forEach(function (item, index) {
                          item['expire'] = book_time[index];
                        })
                      }
                    })
                  }


                  that.setData({
                    booking_list: booking_list
                  })
                }
              })

            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       var that = this;
       var user = wx.getStorageSync('userIdAndToken');
       if(!user || !user.mobile){
            wx.redirectTo({
                 url: '../login/login',
            })
            return;
       }
       const lang = app.globalData.language;
    this.setData({
      language: app.globalData.language,
      isiphx: app.globalData.isiphx,
      auth: user
    })

    
    var time = Date.parse(new Date()) / 1000;
    
    var year = util.formatTimeTwo(time, 'Y-')
    var iph_year = util.formatTimeTwo(time, 'Y/')
    that.setData({
      time: time,
      year: year,
      iph_year: iph_year
    })
    // 获取约课
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_booking_list',
      data: {
        action: 'get_booking_list',
        user_id: user['user_id'],
        _token: user['_token'],
        page: 1
      },
      success: function (res) {
        console.log(res.data.data)
        var booking_list = res.data.data? res.data.data : null;
        //获取是否课程是否到期
        if (booking_list){
          wx.getSystemInfo({
            success: function (res) {
              console.log(res.model)
              var book_time = booking_list.map(function (item) {
                
                    if (res.model.indexOf("iPhone") != -1) {
                      var expire = iph_year + item.book_date.replace(/-/g, '/') + ' ' + item.book_time.split('-')[0];
                      expire = Date.parse(new Date(expire)) / 1000;
                      if (time + 5400 < expire) {
                        return true;
                      } else {
                        return false;
                      } 
                    }else{
                      var expire = year + item.book_date + ' ' + item.book_time.split('-')[0];
                      expire = Date.parse(new Date(expire)) / 1000;
                      if (time + 5400 < expire) {
                        return true;
                      } else {
                        return false;
                      } 
                    } 
              });

              booking_list.forEach(function (item, index) {
                item['expire'] = book_time[index];
              })
            }
          })
        }
        
    
        that.setData({
          booking_list: booking_list
        })
      }
    })

    //获取排行
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_rank_list',
      data: {
        action: 'get_rank_list',
        user_id: user['user_id'],
        _token: user['_token'],
        page: 1
      },
      success: function (res) {
        console.log(res.data.data)
        var rank_list = res.data.data ? res.data.data : null;
        var basecount = rank_list ? rank_list[0].count * 1.2 : 1;
        console.log(basecount)
        
        that.setData({
          rank_list: rank_list,
          basecount: basecount
        })
      }
    })

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
        console.log(res.data)
        var consume_list = res.data.data ? res.data.data : null;
        var balance = res.data.balance ? res.data.balance : 0;
        that.setData({
          consume_list: consume_list,
          balance: balance
        })
      }
    })


    if (app.globalData.userInfo) {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
        })
    } else if (this.data.canIUse) {
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
  // 触摸事件
  tstart: function (e) {
       var that = this;
       var startX = e.changedTouches[0].clientX;
       var startY = e.changedTouches[0].clientY;
       var startTimeStamp = e.timeStamp;
       var dataSet = e.currentTarget.dataset;
       that.setData({
            startX: startX,
            startY: startY,
            startTimeStamp: startTimeStamp,
            dataSet: dataSet
       })
  },
  tend: function (e) {
       var that = this;
       var userId = e.currentTarget.dataset.userid;
       var endX = e.changedTouches[0].clientX;
       var endY = e.changedTouches[0].clientY;
       var endTimeStamp = e.timeStamp;
       var startX = that.data.startX;
       var startY = that.data.startY;
       var startTimeStamp = that.data.startTimeStamp;
       var moveX = endX - startX;
       var moveY = endY - startY;
       var moveDistance = Math.sqrt((startX * startX) - (endX * endY));
       var moveTime = endTimeStamp - startTimeStamp;
       var dis = Number(that.data.nav);
       if (moveX < -50 && dis < 3) {
            dis++;
            that.setData({
                 nav: dis
            });
       } else if (moveX > 50 && dis > 1) {
            dis--;
            that.setData({
                 nav: dis
            });
       }
  },
})