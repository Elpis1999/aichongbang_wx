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
    storeGroup: [],
    money: 0,
    reservationService: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.show();
  },

  show() {
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
        console.log(data, "dadadada");
        let reservationService = data.reservationService;
        data.shoppingCart = [...data.shoppingCart, ...reservationService];
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

        console.log(reservationService, "reservationService");

        this.setData({
          shoppingCart: arr,
          storeGroup,
          reservationService
        }, function () {
          this.calculationMoney();
          console.log(this.data.shoppingCart, "48489484");
        });
      }
    });
  },
  calculationMoney() {
    let shoppingCart = this.data.shoppingCart;
    let money = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j].choice == 1) {
          if (shoppingCart[i][j].sur_price) {
            money += parseFloat(shoppingCart[i][j].sur_price);
          } else {
            money += parseFloat(shoppingCart[i][j].subtotal);
          }
        }
      }
    }
    this.setData({
      money
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
    console.log("hahhahahhahaha");
    let refresh = wx.getStorageSync("refresh");
    console.log(refresh);
    if (refresh != 0) {
      this.show();
      console.log("show");
    }
    wx.setStorage({
      key: 'refresh',
      data: 1
    })
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
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let shoppingCart = this.data.shoppingCart;
    if (id) {
      for (let i = 0; i < shoppingCart.length; i++) {
        for (let j = 0; j < shoppingCart[i].length; j++) {
          if (id == shoppingCart[i][j]._id) {
            shoppingCart[i][j].choice = shoppingCart[i][j].choice == 0 ? 1 : 0;
            this.notFullyElected();
            break;
          }
        }
      }
    } else {
      let time = e.currentTarget.dataset.time;
      for (let i = 0; i < shoppingCart.length; i++) {
        for (let j = 0; j < shoppingCart[i].length; j++) {
          console.log("item", shoppingCart[i][j]);
          if (shoppingCart[i][j].sur_date) {
            console.log(shoppingCart[i][j].sur_date, time);
            if (time == shoppingCart[i][j].sur_date) {
              shoppingCart[i][j].choice = shoppingCart[i][j].choice == 0 ? 1 : 0;
              this.notFullyElected();
              break;
            }
          }
        }
      }
    }



    this.setData({
      shoppingCart
    });
    this.notFullyElectedStore(index);
    this.calculationMoney();
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
    this.notFullyElected();
    this.calculationMoney();
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
    this.setData({
      allElection,
      storeGroup,
      shoppingCart
    });
    this.calculationMoney();
  },
  notFullyElected() {
    let shoppingCart = this.data.shoppingCart;
    let allElection = true;
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j].choice == 0) {
          allElection = false;
          break;
        }
      }
    }
    this.setData({
      allElection
    });
  },
  notFullyElectedStore(index) {
    console.log(index);
    let storeGroup = this.data.storeGroup;
    let shoppingCart = this.data.shoppingCart;
    let bl = true;
    for (let i = 0; i < shoppingCart[index].length; i++) {
      if (shoppingCart[index][i].choice == 0) {
        storeGroup[index] = 0;
        bl = false;
        break;
      }
    }
    if (bl) {
      storeGroup[index] = 1;
    }
    console.log(storeGroup);
    this.setData({
      storeGroup
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
    let shoppingCart = this.data.shoppingCart;

    wx.setStorage({
      key: 'refresh',
      data: 0
    })


    let newShoppingCart = [];
    for (let i = 0; i < shoppingCart.length; i++) {
      let arr = [...shoppingCart[i]];
      newShoppingCart.push(arr);
    }

    for (let i = 0; i < newShoppingCart.length; i++) {
      for (let j = 0; j < newShoppingCart[i].length; j++) {
        if (newShoppingCart[i][j].choice == 0) {
          newShoppingCart[i].splice(j, 1);
        }
      }
    }

    for (let i = 0; i < newShoppingCart.length; i++) {
      if (newShoppingCart[i].length === 0) {
        newShoppingCart.splice(i, 1);
      }
    }
    console.log("newShoppingCart",newShoppingCart);
    wx.navigateTo({
      url: "../order/order" + "?shoppingCart=" + JSON.stringify(newShoppingCart)
    });
  },
  delete(e) {
    console.log(e);
  },
  delItem(e) {
    let itemId = e.currentTarget.dataset.id;
    let openId = wx.getStorageSync('openId');
    wx.showModal({
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            method: "post",
            url: url + "/wxgoods/deleteShoppingCartItem",
            data: {
              itemId,
              openId
            },
            success: () => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              this.show();
            }
          });
        }
      }
    })
  },
  delItemService(e) {
    let openId = wx.getStorageSync('openId');
    let time = e.currentTarget.dataset.time;

    wx.showModal({
      content: '确定要删除此服务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            method: "post",
            url: url + "/wxgoods/deleteServiceItem",
            data: {
              time,
              openId
            },
            success: () => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              this.show();
            }
          });
        }
      }
    })
  }
})