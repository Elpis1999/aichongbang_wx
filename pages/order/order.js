// pages/order/order.js
let {
  url
} = require("../../config/index");
let {
  formatTime
} = require("../../utils/util");
let newOptions = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    commodity: [],
    price: [],
    total: 0,
    address: {},
    isAddress: false, //用户是否之前输入过地址
    petMaster: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "123333");
    newOptions = options;
    this.show(options);
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
  show(options) {
    if (!options) {
      options = newOptions;
    }
    let openId = wx.getStorageSync('openId');
    let index = wx.getStorageSync('selectIndex');
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
        let {
          location
        } = data;
        if (location) {
          this.setData({
            address: location[index],
            isAddress: true,
            petMaster: data
          }, function () {
            console.log(this.data.address, "地址");
          });
        }
      }
    });
    let commodity = JSON.parse(options.shoppingCart);
    let price = [];
    let total = 0;
    for (let i = 0; i < commodity.length; i++) {
      let money = 0;
      for (let j = 0; j < commodity[i].length; j++) {
        money += parseFloat(commodity[i][j].sur_price) || parseFloat(commodity[i][j].subtotal);
      }
      price.push(money);
    }
    for (let i = 0; i < price.length; i++) {
      total += price[i];
    }
    this.setData({
      total,
      commodity,
      price
    });
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
  newAddress() {
    wx.navigateTo({
      url: "../newaddress/newaddress"
    });
  },
  toAddressList() {
    wx.navigateTo({
      url: "../addresslist/addresslist"
    });
  },
  placeOrder() {
    let openId = wx.getStorageSync('openId');
    let {
      address,
      petMaster
    } = this.data
    let order = {};
    order.openId = openId;
    order.userName = address.name;
    order.addr = address.region + ',' + address.dAddress;
    order.phone = address.phone;
    order.petMasterId = petMaster._id;
    let thing = JSON.parse(newOptions.shoppingCart);
    for (let i = 0; i < thing.length; i++) {
      for (let j = 0; j < thing[i].length; j++) {
        if (thing[i][j].class == 2) {
          thing[i][j].state = "未完成";
        } else {
          thing[i][j].state = "已完成";
        }
      }
    }
    order.thing = thing;
    let newDate = formatTime(new Date());
    order.time = newDate;
    wx.request({
      method: "post",
      url: url + "/wxgoods/generateOrder",
      data: order,
      success: () => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 5000,
          success: () => {
            wx.setStorage({
              key: 'refresh',
              data: 1
            });
            wx.switchTab({
              url: "../shoppingcart/shoppingcart"
            });
          }
        });

      }
    });

  }
})