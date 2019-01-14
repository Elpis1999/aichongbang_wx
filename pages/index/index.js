// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=1PZH3APruxDvNkbQheag4vXntKZlF6Bu&location=' + latitude + "," + longitude + "&output=json",
          method: "get",
          success: (res) => {
            this.setData({
              address: res.data.result.formatted_address
            });
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

  },
  goShoppingCart(e) {
    wx.switchTab({
      url: "../shoppingcart/shoppingcart"
    });
  }
})