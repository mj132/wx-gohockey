// pages/find_detail/find_detail.js
const app = getApp()
var time = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language
    })
    const lang = app.globalData.language;
    //获取发现详情
    var that = this;
    var id = options.id;
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_gohockey_detail',
      data: { 'action': 'get_gohockey_detail','id': id},
      success: function(res) {
        console.log(res.data.data)
        var detail = res.data.data;
        var ctime = time.formatTimeTwo(detail["ctime"], 'M月D日');
        var en_ctime = time.formatTimeTwo(detail["ctime"], 'M-D');
        
        that.setData({
          detail: detail,
          ctime: ctime,
          en_ctime: en_ctime
        })

        WxParse.wxParse('article', 'html', detail.content, that, 5);
        WxParse.wxParse('article_en', 'html', detail.en_content, that, 5);
        
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