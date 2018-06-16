// pages/recharge/ad/recharge.js
const wxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     lang: app.globalData.language
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     that.getADImage();
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
     var that = this;
     that.getADImage();
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
  getADImage: function (e) {
       var that = this;
       wx.request({
            url: 'https://xiaochengxu.gogohockey.com/api/get_slide_image',
            data: { 'action': 'get_slide_image', 'type': 3, 'page': 1 },
            success: function (res) {
                 var data = res.data.data;
                 that.setData({
                      'ad': data[0]
                 });
                 wxParse.wxParse('content', 'html', decodeURIComponent(data[0].description), that, 5)
                 wxParse.wxParse('en_content', 'html', data[0].en_description, that, 5)
                 wx.stopPullDownRefresh();
            }
       })
  },
})