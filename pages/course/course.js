// pages/course/course.js
const app = getApp()
var util = require('../../utils/util.js');
var res = app.globalData.res;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: 'course',
    user: 6,
    add_index: 0,
    lan_index: 0,
    city_id: 1,
    language: true,
    lan_list: ['English','中文'],
    res: res
  },
  gocourse_detail: function(e) {
    // console.log(e.currentTarget.dataset.id)
    var course_id = e.currentTarget.dataset.id;
    var timeid = e.currentTarget.dataset.timeid;
    var date = e.currentTarget.dataset.date;
    var over = e.currentTarget.dataset.over || 0;
    
    wx.navigateTo({
      url: '../course_detail/course_detail?id=' + course_id + '&timeid=' + timeid + '&date=' + date + '&over=' + over
    })
  },
  gosignup: function (e) {
    var course_id = e.currentTarget.dataset.id;
    var timeid = e.currentTarget.dataset.timeid;
    var date = e.currentTarget.dataset.date;
    wx.navigateTo({
      url: '../signup/signup?id=' + course_id + '&timeid=' + timeid + '&date=' + date
    })
  },
  //语言的选择
  lanChange: function(){
    if(this.data.lan_index == 0){
      var lan_index = 1;
    }else{
      var lan_index = 0;
    }
    
    if(lan_index == 1){
      app.globalData.language = false;
      wx.setStorageSync('lang', false);
    }else{
      app.globalData.language = true;
      wx.setStorageSync('lang', true);
    }
    console.log(app.globalData.language)
    this.setData({
      language: app.globalData.language,
      lan_index: lan_index
    })
  },
  // 地址选择
  addressChange: function (e) {
    var that = this;
    // console.log(e)
    var add_index = e.detail.value;
    this.setData({
      add_index: add_index,
      city_id: this.data.city_list[add_index].id
    })
    
    // 动态获取城市场地
    // wx.request({
    //   url: 'https://xiaochengxu.gogohockey.com/api/ajax_get_space',
    //   data: { city_id: this.data.city_id },
    //   success: function (res) {
    //     console.log(res.data.data)
    //     var arr = res.data.data;
    //     that.setData({
    //       rink_list: arr,
    //       rink_index: 0,
    //       id: arr[0].id
    //     })
        // 筛选课程
        wx.request({
          url: 'https://xiaochengxu.gogohockey.com/api/get_course_list',
          data: {
            action: 'get_course_list',
            date: that.data.myDate,
            city_id: that.data.city_id,
            // space_id: that.data.id,
            user_id: app.globalData.user_id,
            page: 1
          },
          success: function (res) {
            console.log(res.data.data)
            var list = res.data.data ? res.data.data : null;
            
            that.setData({
              course_list: list
            })
            
      
          }
        })
    //   }
    // })
    
  },

  // 冰场选择
  rinkChange: function (e) {
    // console.log(e)
    // var that = this;
    // var rink_index = e.detail.value;
    // this.setData({
    //   rink_index: rink_index,
    //   id: this.data.rink_list[rink_index].id
    // })
    // 筛选课程
    // wx.request({
    //   url: 'https://xiaochengxu.gogohockey.com/api/get_course_list',
    //   data: {
    //     action: 'get_course_list',
    //     date: this.data.myDate,
    //     ciyt_id: this.data.city_id,
    //     space_id: this.data.id,
    //     user_id: app.globalData.user_id,
    //     page: 1
    //   },
    //   success: function (res) {
    //     // console.log(res.data.data)
    //     var list = res.data.data ? res.data.data : null;
        
    //     that.setData({
    //       course_list: list
    //     })
        
    //   }
    // })
  },

  // 日期选择
  dateChange: function(e) {
    var that = this;
    this.setData({
      date_curr: e.currentTarget.dataset.d,
      myDate: e.currentTarget.dataset.y
    })
    // 筛选课程
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_course_list',
      data: {
        action: 'get_course_list',
        date: that.data.myDate,
        city_id: that.data.city_id,
        // space_id: that.data.id,
        user_id: app.globalData.user_id,
        page: 1
      },
      success: function (res) {
        console.log(res.data.data)
        var list = res.data.data ? res.data.data : null;
        
        that.setData({
          course_list: list
        })
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       var user = wx.getStorageSync('userIdAndToken');
       if (!user || !user.mobile) {
            wx.redirectTo({
                 url: '../index/index',
            });
            return;
       }
       const lang = app.globalData.language;
    this.setData({
      language: app.globalData.language,
      isiphx: app.globalData.isiphx
    })
    if (app.globalData.language){
      this.setData({
        lan_index: 0
      })
    }else{
      this.setData({
        lan_index: 1
      })
    }
    // console.log(options.id)
    var id = options.id;
    var cityid = options.cityid;
    
    if(id){
      wx.setStorageSync('id', id);
      wx.setStorageSync('cityid', cityid);
    }
    
    if(!id){
      id = wx.getStorageSync('id');
      
    }
    if (!cityid) {
      cityid = wx.getStorageSync('cityid');
    }
    var that = this;

    //判断是否报名过体验课
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/check_user_exp',
      data: {
        action: 'check_user_exp',
        user_id: app.globalData.user_id
      },
      success: function (res) {
        console.log(res.data.status)
        that.setData({
          exper: res.data.status
        })
      }
    })
    //获取当前日期
    var week_arr = ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'];
    var week_arr_en = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    var date = new Date();
    var time = Date.parse(new Date()) / 1000;
    var year = util.formatTimeTwo(time, 'Y');
    var month = util.formatTimeTwo(time, 'M');
    var d = util.formatTimeTwo(time, 'D');
    var myDate = util.formatTimeTwo(time, 'Y-M-D');
    var week = week_arr[date.getDay()];
    this.setData({
      'id': id,
      'city_id': cityid,
      'add_index': cityid - 1,
      'date_curr': d,
      'year': year,
      'month': month,
      'date': [{
        y: util.formatTimeTwo(time, 'Y-M-D'),
        d: util.formatTimeTwo(time, 'D')
      }, {
        y: util.formatTimeTwo(time + 3600 * 24, 'Y-M-D'),
        d: util.formatTimeTwo(time + 3600 * 24, 'D')
        }, {
          y: util.formatTimeTwo(time + 3600 * 24 * 2, 'Y-M-D'),
          d: util.formatTimeTwo(time + 3600 * 24 * 2, 'D')
      }, {
          y: util.formatTimeTwo(time + 3600 * 24 * 3, 'Y-M-D'),
          d: util.formatTimeTwo(time + 3600 * 24 * 3, 'D')
        }, {
          y: util.formatTimeTwo(time + 3600 * 24 * 4, 'Y-M-D'),
          d: util.formatTimeTwo(time + 3600 * 24 * 4, 'D')
      }, {
          y: util.formatTimeTwo(time + 3600 * 24 * 5, 'Y-M-D'),
          d: util.formatTimeTwo(time + 3600 * 24 * 5, 'D')
        }, {
          y: util.formatTimeTwo(time + 3600 * 24 * 6, 'Y-M-D'),
          d: util.formatTimeTwo(time + 3600 * 24 * 6, 'D')
        }],
      'myDate': myDate,
      'week_cn': [week, week_arr[date.getDay() + 1], week_arr[date.getDay() + 2], week_arr[date.getDay() + 3], week_arr[date.getDay()+ 4], week_arr[date.getDay() + 5], week_arr[date.getDay() + 6]],
      'week_en': [week_arr_en[date.getDay()], week_arr_en[date.getDay() + 1], week_arr_en[date.getDay() + 2], week_arr_en[date.getDay() + 3], week_arr_en[date.getDay() + 4], week_arr_en[date.getDay() + 5], week_arr_en[date.getDay() + 6]]
    })

   
    
    //筛选课程
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_course_list',
      data: {
        action: 'get_course_list',
        date: that.data.myDate,
        city_id: that.data.city_id,
        // space_id: that.data.id,
        user_id: app.globalData.user_id,
        page: 1
      },
      success: function (res) {
        console.log(res.data.data)
        var list = res.data.data ? res.data.data : null;
        
        that.setData({
          course_list: list
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
    } 

    // 获取城市
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_city_list',
      data: {action : 'get_city_list'},
      success: function(res) {
        // console.log(res.data.data)
        var arr = res.data.data;
        that.setData({
          city_list: arr
        })
      }
    })

    // 动态获取城市场地
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/ajax_get_space',
      data: { city_id: this.data.city_id },
      success: function (res) {
        // console.log(res.data.data)
        var arr = res.data.data;
        if(arr){
          arr.map(function (item, index) {
            if (item.id == id) {
              that.setData({
                rink_index: index
              })
            }
          })
        }
        
        that.setData({
          rink_list: arr
        })
      }
    })
    
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
  // 底部跳转事件处理函数
  gogohockey: function() {
    wx.redirectTo({
      url: '../gohockey/gohockey'
    })
  },
  gomine: function () {
    wx.redirectTo({
      url: '../mine/mine'
    })
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
       console.log(this);
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
       var date = that.data.date;
       var dis = Number(e.currentTarget.dataset.dis);
       var disCalc = Number(that.data.date_curr);
       var dateY = date[0]
       console.log(dis)
       console.log(moveX)
       console.log(date);
       if (moveX < -50 && disCalc < dis + 5) {
          disCalc ++;
          for(var i =0 ; i < date.length; i++){
               if(date[i].d == disCalc){
                    dateY = date[i].y;
               }
          }
          that.setData({
               date_curr: disCalc.length < 2 ? '0' + disCalc : disCalc,
               myDate: dateY
          });
          that.getCourseList();
       }else if(moveX > 50 && disCalc >=dis){
            disCalc --;
            for (var i = 0; i < date.length; i++) {
                 if (date[i].d == disCalc) {
                      dateY = date[i].y;
                 }
            }
            that.setData({
                 date_curr: disCalc.length < 2 ? '0' + disCalc : disCalc,
                 myDate: dateY
            });
            that.getCourseList();
       }
  },

  getCourseList: function(e){
       var that = this;
       var auth = wx.getStorageSync('userIdAndToken');
       // 筛选课程
       wx.request({
            url: 'https://xiaochengxu.gogohockey.com/api/get_course_list',
            data: {
                 action: 'get_course_list',
                 date: that.data.myDate,
                 city_id: that.data.city_id,
                 // space_id: that.data.id,
                 user_id: auth.id,
                 page: 1
            },
            success: function (res) {
                 console.log(res.data.data)
                 var list = res.data.data ? res.data.data : null;

                 that.setData({
                      course_list: list
                 })

            }
       })
  }
})