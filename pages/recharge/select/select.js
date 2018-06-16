// pages/recharge/select/select.js
const app = getApp()
const lang = app.globalData.language;
const wxParse =  require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   sel_index: 0,
   language: true
  },
  sel_money: function(e) {
    var sel_index = e.currentTarget.dataset.id;
    this.setData({
      sel_index: sel_index,
      id: this.data.sel[sel_index].id
    })
  },
  // 充值成功
  gopay: function() {
    var that = this;
    var user = wx.getStorageSync("userIdAndToken");
    // 充值
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/buy',
      data: {
        action: 'buy',
        user_id: user['user_id'],
        _token: user['_token'],
        id: that.data.id
      },
      success: function (res) {
        console.log(res.data.params)
        var params = res.data.params;

        //调起微信支付接口
        wx.requestPayment({
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.sign,
          success: function(res) {
            console.log(res.data)
            wx.navigateTo({
              url: '../../recharge/success/success'
            })
          },
          fail: function(){
            
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       var user = wx.getStorageSync('userIdAndToken');
       const lang = app.globalData.language;
       if (!user || !user.mobile) {
            wx.redirectTo({
                 url: '../../index/index',
            });
            return;
       }
       this.getADImage();
    this.setData({
      language: app.globalData.language
    })
    var that = this;
    // 充值商品列表
    wx.request({
      url: 'https://xiaochengxu.gogohockey.com/api/get_product_list',
      data: {
        action: 'get_product_list',
        page: 1
      },
      success: function(res) {
        console.log(res.data.data)
        var sel = res.data.data;
        that.setData({
          sel: sel,
          id: sel[0].id
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
  
  },
  getADImage: function(e){
       var that = this;
       wx.request({
            url: 'https://xiaochengxu.gogohockey.com/api/get_slide_image',
            data: { 'action': 'get_slide_image', 'type': 3, 'page': 1 },
            success: function (res) {
                 that.setData({
                      'adImage': res.data.data
                 });
                 var data = res.data.data;
                 for(var i = 0 ; i< data.length; i++){
                      console.log(data)
                      wxParse.wxParse('content', 'html', data[i].description, that, 5)
                      wxParse.wxParse('en_content', 'html', data[i].en_description, that, 5)
                 }
            }
       })
  },
  gourl: function (e) {
       var that = this;
       var id = e.currentTarget.dataset.id;
       var reg = /^\d+$/;
       var ad = that.data.adImage[0];
       var title = ad.title;
       var en_title = ad.en_title;
       var content = ad.description;
       var en_content = ad.en_description;
     wx.navigateTo({
          url: '../ad/ad?title=' + title + '&en_title=' + en_title + '&content=' + content + '&en_content=' + en_content
     })

  },
})