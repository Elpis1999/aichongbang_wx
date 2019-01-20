// pages/addresslist/addresslist.js
let {
  url
} = require("../../config/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: [],
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.show();
  },
  show() {
    let openId = wx.getStorageSync("openId");
    let index = wx.getStorageSync("selectIndex");
    index = index || 0;

    wx.request({
      method: "get",
      url: url + '/wxgoods/searchPetMaster',
      data: {
        type: "openId",
        value: openId
      },
      success: ({
        data
      }) => {
        this.setData({
          location: data.location,
          selectIndex: index
        });
      }
    });
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
    this.show();
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
  removeAddress(e) {
    let openId = wx.getStorageSync("openId");
    let {
      index
    } = e.currentTarget.dataset;
    console.log(index, 'index');
    wx.request({
      method: 'post',
      url: url + "/wxgoods/removeAddress",
      data: {
        openId,
        index
      },
      success: () => {
        this.show();
      }
    });
  },
  toAddAddress() {
    wx.navigateTo({
      url: '../newaddress/newaddress'
    });
  },
  select(e) {
    let {
      index
    } = e.currentTarget.dataset;
    wx.setStorage({
      key: 'selectIndex',
      data: index
    });
    this.setData({
      selectIndex: index
    });
    wx.navigateBack({
      url: "../order/order"
    });
  }
})