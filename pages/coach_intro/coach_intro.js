// pages/coach_intro/coach_intro.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
const lang = app.globalData.language;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: true
  },
  // 左右切换
  goleft: function() {
    var l = this.data.coach_list.length;
    
    if (this.data.index <= 0){
      this.setData({ index: l-1})
    }else{
      this.setData({ index: this.data.index-1 })
    }
    WxParse.wxParse('coachintro', 'html', this.data.coach_list[this.data.index].content, this, 5);
    WxParse.wxParse('coachen', 'html', this.data.coach_list[this.data.index].en_content, this, 5);
  },
  goright: function () {
    var l = this.data.coach_list.length;
    if (this.data.index >= l-1) {
      this.setData({ index: 0 })
    } else {
      this.setData({ index: this.data.index+1 })
    }
    WxParse.wxParse('coachintro', 'html', this.data.coach_list[this.data.index].content, this, 5);
    WxParse.wxParse('coachen', 'html', this.data.coach_list[this.data.index].en_content, this, 5);
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
    this.setData({
      language: app.globalData.language
    })
    // 获取教练信息
    var that = this;
    var id = options.id;
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_gohockey_detail',
      data: { 'action': 'get_gohockey_detail', 'id': id },
      success: function (res) {
        console.log(res.data.data)
        var detail = res.data.data;
        that.setData({
          detail: detail
        })
      }
    })

    // 获取教练列表
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_coach_list',
      data: { 'action': 'get_coach_list', 'page': 1 },
      success: function (res) {
        console.log(res.data.data)
        var coach_list = res.data.data;
        that.setData({
          'coach_list': coach_list
        })
        coach_list.map(function(item,index){
          if(item.id == id){
            that.setData({
              'index': index
            })
            WxParse.wxParse('coachintro', 'html', coach_list[index].content, that, 5);
            WxParse.wxParse('coachen', 'html', coach_list[index].en_content, that, 5);
            return;
          }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})