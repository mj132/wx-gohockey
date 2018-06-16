// pages/gohockey/gohockey.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    language: true
  },
  gocoach_intro: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../coach_intro/coach_intro?id=' + id
    })
  },
  gourl: function (e) {
    var id = e.currentTarget.dataset.id;
    var reg = /^\d+$/;
    if(reg.test(id)){
      wx.navigateTo({
        url: '../find_detail/find_detail?id=' + id
      })
    }else{
      wx.navigateTo({
        url: '../url/url?id=' + id
      })
    }
    
  },
  gofind_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../find_detail/find_detail?id=' + id
    })
  },
  // 底部跳转事件处理函数
  gocourse: function () {
       var user = wx.getStorageSync('userIdAndToken');
       if (!user || !user.mobile) {
            wx.redirectTo({
                 url: '../index/index',
            });
            return;
       }
    wx.redirectTo({
      url: '../course/course'
    })
  },
  gomine: function () {
       var user = wx.getStorageSync('userIdAndToken');
       if (!user || !user.mobile) {
            wx.redirectTo({
                 url: '../index/index',
            });
            return;
       }
    wx.redirectTo({
      url: '../mine/mine'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language,
      isiphx: app.globalData.isiphx
    })
    
       const lang = app.globalData.language;
    // 获取轮播图
    var that = this;
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_slide_image',
      data: {'action':'get_slide_image','type': 2,'page': 1},
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          'slide_image': res.data.data
        })
      }
    })

    // 获取教练列表
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_coach_list',
      data: { 'action': 'get_coach_list', 'page': 1 },
      success: function (res) {
        console.log(res.data.data)
        
        that.setData({
          'coach': res.data.data
        })
        
      }
    })

    // 获取发现列表
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_discover_list',
      data: { 'action': 'get_discover_list','page': 1,per_page:3 },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          'find_image': res.data.data
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
    var that = this;
    
    // 页数+1  
    var page = that.data.page + 1;
    
    that.setData({
      page: page
    })
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_discover_list',
      data: { 'action': 'get_discover_list', 'page': page, per_page: 3 },
      success: function (res) {
        // 回调函数  
        var find_list = that.data.find_image;
        var d = res.data.data;
        if(d){
          // 显示加载图标  
          wx.showLoading({
            title: lang ? '加载中...' : 'Loading...'
          })
          var l = d.length;
          for (var i = 0; i < l; i++) {
            find_list.push(res.data.data[i]);
          }
        }else{
          //提示
          wx.showToast({
            title: lang ? '没有更多了' : 'No More Data',
            icon: 'none',
            duration: 800
          })
          return false;
        }
        
        // 设置数据  
        that.setData({
          find_image: find_list
        })
        console.log(that.data.find_image)
        if(d){
          // 隐藏加载框  
          wx.hideLoading();
        }
        
      }
    })  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})