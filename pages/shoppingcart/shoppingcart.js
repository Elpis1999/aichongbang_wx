// pages/cart/cart.js
let {
  url
} = require("../../config/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    shoppingCart: [],
    bianji: false,
    allElection: true,
    storeGroup: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openId = wx.getStorageSync("openId");
    wx.request({
      method: "get",
      url: url + "/wxgoods/searchPetMaster",
      data: {
        type: "openId",
        value: openId
      },
      success: ({
        data
      }) => {
        //数组去重
        let hash = {};
        let newArr = data.shoppingCart.reduce(function (item, next) {
          hash[next.store._id] ? '' : hash[next.store._id] = true && item.push(next);
          return item
        }, [])

        let arr = [];
        let storeGroup = [];
        for (let i = 0; i < newArr.length; i++) {
          let newAry = [];
          for (let j = 0; j < data.shoppingCart.length; j++) {
            if (newArr[i].store._id == data.shoppingCart[j].store._id) {
              let newGoods = { ...data.shoppingCart[j],
                choice: 1
              };
              newAry.push(newGoods);
            }
          }
          arr.push(newAry);
          storeGroup.push(1);
        }
        this.setData({
          shoppingCart: arr,
          storeGroup
        }, function () {
          console.log(this.data.shoppingCart);
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
  edit() {
    this.setData({
      bianji: !this.data.bianji
    });
  },
  iconSwitch(e) {
    let id = e.currentTarget.dataset.id;
    let shoppingCart = this.data.shoppingCart;
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (id == shoppingCart[i][j]._id) {
          shoppingCart[i][j].choice = shoppingCart[i][j].choice == 0 ? 1 : 0;
        }
      }
    }
    this.setData({
      shoppingCart
    });
  },
  storeSwitch(e) {
    let index = e.currentTarget.dataset.index;
    let storeGroup = this.data.storeGroup;
    let shoppingCart = this.data.shoppingCart;
    if (storeGroup[index] == 0) {
      storeGroup[index] = 1;
      for (let i = 0; i < shoppingCart[index].length; i++) {
        shoppingCart[index][i].choice = 1;
      }
    } else {
      storeGroup[index] = 0;
      for (let i = 0; i < shoppingCart[index].length; i++) {
        shoppingCart[index][i].choice = 0;
      }
    }
    this.setData({
      storeGroup,
      shoppingCart
    });
  },
  allSwitch() {
    let allElection = this.data.allElection;
    let storeGroup = this.data.storeGroup;
    let shoppingCart = this.data.shoppingCart;
    if (allElection) {
      allElection = !allElection;
      for (let i = 0; i < storeGroup.length; i++) {
        storeGroup[i] = 0;
      }
      for (let i = 0; i < shoppingCart.length; i++) {
        for (let j = 0; j < shoppingCart[i].length; j++) {
          shoppingCart[i][j].choice = 0;
        }
      }
    } else {
      allElection = !allElection;
      for (let i = 0; i < storeGroup.length; i++) {
        storeGroup[i] = 1;
      }
      for (let i = 0; i < shoppingCart.length; i++) {
        for (let j = 0; j < shoppingCart[i].length; j++) {
          shoppingCart[i][j].choice = 1;
        }
      }
    }
    console.log(shoppingCart);
    this.setData({
      allElection,
      storeGroup,
      shoppingCart
    });
  },
  changeNumber(e) {
    let id = e.currentTarget.dataset.id;
    let num = e.detail;
    let shoppingCart = this.data.shoppingCart;
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j]._id == id) {
          shoppingCart[i][j].purchaseQuantity = num;
          shoppingCart[i][j].subtotal = (shoppingCart[i][j].saleprice * shoppingCart[i][j].purchaseQuantity).toFixed(2);
        }
      }
    }
    this.setData({
      shoppingCart
    }, function () {
      let openId = wx.getStorageSync('openId');
      let shoppingCart = this.data.shoppingCart;
      wx.request({
        method: "post",
        url: url + "/wxgoods/updateShoppingCart",
        data: {
          openId,
          shoppingCart
        }
      });
    });
  },
  settlement(e) {
    console.log(e);
  },
  delete(e) {
    console.log(e);
  },
  delItem(e) {
    let itemId = e.currentTarget.dataset.id;
    let openId = wx.getStorageSync('openId');
    wx.request({
      method: "post",
      url: url + "/wxgoods/deleteShoppingCartItem",
      data: {
        itemId,
        openId
      }
    });
  }
})