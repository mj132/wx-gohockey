// pages/course_detail/course_detail.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: true,
    markers: [],
    hasmarkers: false,
    isBig: wx.getStorageSync('sysinfo').windowWidth > 410
  },
  openlocation: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      scale: 18,
      name: this.data.space.name,
      address: this.data.space.address
    })
  },
  gosignup: function(e) {
    var course_id = e.currentTarget.dataset.id;
    var timeid = e.currentTarget.dataset.timeid;
    var date = e.currentTarget.dataset.date;
    wx.navigateTo({
      url: '../signup/signup?id=' + course_id + '&timeid=' + timeid + '&date=' + date
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       var user = wx.getStorageSync('userIdAndToken');
       if (!user || !user.mobile) {
            wx.redirectTo({
               //   url: '../index/index',
            });
          //   return;
       }
       const lang = app.globalData.language;
    this.setData({
      language: app.globalData.language,
     // language: false,
      isiphx: app.globalData.isiphx
    })
    //获取课程id
    var that = this;
    var course_id = options.id;
    var timeid = options.timeid;
    var date = options.date;
    var over = options.over;
    console.log(over)
    this.setData({
      course_id: course_id,
      time_id: timeid,
      myDate: date,
      over: over
    })
    //判断是否报名过体验课
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/check_user_exp',
      data: {
        action: 'check_user_exp',
        user_id: app.globalData.user_id
      },
      success: function(res) {
        console.log(res.data.status)
        that.setData({
          exper: res.data.status
        })
      }
    })
    var user = wx.getStorageSync("userIdAndToken");
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_course_detail',
      data: {
        action: 'get_course_detail',
        id: course_id,
        time_id: timeid,
        date: date,
        user_id: user['user_id'],
        _token: user['_token']
      },
      success: function(res) {
        console.log(res.data)
        var d = res.data.data;
        var space = res.data.space;
        var bookinguser = res.data.booking ? res.data.booking : null;
        var if_book = res.data.if_book ? res.data.if_book : null;
        that.setData({
          detail: d, 
          space: space,
          bookinguser: bookinguser,
          if_book: if_book,
          longitude: space.longitude,
          latitude: space.latitude,
          markers: [{
            iconPath: "../../imgs/icon_navigation.png",
            id: space.id,
            latitude: space.latitude,
            longitude: space.longitude,
            width: 20,
            height: 20
          }],
          hasmarkers: true
        })
        wx.setNavigationBarTitle({ title: d.title })

        WxParse.wxParse('description', 'html', d.description, that, 5);
        WxParse.wxParse('en_description', 'html', d.en_description, that, 5);
      }
    })

    //

   
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
  
  }
})