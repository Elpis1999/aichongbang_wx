// pages/cart/cart.js
let {
  url
} = require("../../config/index");
let {
  conversionFormatTime,
  deepcopy

} = require("../../utils/util");
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
    reservationService: [],
    serviceArr: [],
    index: 0
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
        let reservationService = data.reservationService;
        console.log(reservationService, "reservationService");
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
                choice: 1,
              };
              if (newGoods.class === "2") {
                newGoods.timeSlot = conversionFormatTime(newGoods.sur_date);
              }
              newAry.push(newGoods);
            }
          }
          arr.push(newAry);
          storeGroup.push(1);
        }

        //判断购物车中是否有商品
        let allElection = true;
        if (storeGroup.length === 0) {
          allElection = false;
        }
        this.setData({
          shoppingCart: arr,
          storeGroup,
          reservationService,
          allElection,
        }, function () {
          this.calculationMoney();
          this.setTimeArr();
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
    let refresh = wx.getStorageSync("refresh");
    if (refresh != 0) {
      this.show();
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
    this.calculationMoney();
    this.setData({
      bianji: !this.data.bianji
    });
  },
  setTimeArr() {
    let serviceArr = [];
    let shoppingCart = [];
    for (let i = 0; i < this.data.shoppingCart.length; i++) {
      let arr = [...this.data.shoppingCart[i]];
      shoppingCart.push(arr);
    }
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j].class == 2) {
          wx.request({
            method: 'get',
            url: url + '/wxgoods/serviceById',
            data: {
              id: shoppingCart[i][j]._id
            },
            success: ({
              data
            }) => {
              let {
                timeArr,
                timeAry
              } = conversionFormatTime(data.sur_date);
              data.timeArr = timeArr;
              data.timeAry = timeAry;
              serviceArr.push(data);
              this.setData({
                serviceArr
              });
            }
          });
        }
      }
    }
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
          if (shoppingCart[i][j].sur_date) {
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
    this.setData({
      storeGroup
    });
  },
  changeNumber(e) {
    let id = e.currentTarget.dataset.id;
    let num = e.detail;

    //复制二维数组
    let shoppingCart = [];
    for (let i = 0; i < this.data.shoppingCart.length; i++) {
      let arr = [...this.data.shoppingCart[i]];
      shoppingCart.push(arr);
    }


    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j].class == 2) {
          shoppingCart[i].splice(j, 1);
        }
      }
    }
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].length === 0) {
        shoppingCart.splice(i, 1);
      }
    }
    for (let i = 0; i < shoppingCart.length; i++) {
      for (let j = 0; j < shoppingCart[i].length; j++) {
        if (shoppingCart[i][j]._id == id) {
          shoppingCart[i][j].purchaseQuantity = num;
          shoppingCart[i][j].subtotal = (shoppingCart[i][j].saleprice * shoppingCart[i][j].purchaseQuantity).toFixed(2);
        }
      }
    }

    let openId = wx.getStorageSync('openId');
    wx.request({
      method: "post",
      url: url + "/wxgoods/updateShoppingCart",
      data: {
        openId,
        shoppingCart
      },
      success: () => {
        this.show();
      }
    });
  },
  settlement(e) {
    let shoppingCart = this.data.shoppingCart;

    wx.setStorage({
      key: 'refresh',
      data: 0
    })

    let newShoppingCart = deepcopy(shoppingCart);
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

    //判断购物车中是否有商品
    console.log(newShoppingCart);
    if (newShoppingCart.length === 0) {
      wx.showModal({
        title: '提示',
        content: '购物车中没有物品!',
        success: function (res) {
          if (res.confirm) {
            return;
          }
        }
      })
      return;
    } else {
      //判断购物车中是否有实效的物品
      let flag = true;
      for (let i = 0; i < newShoppingCart.length; i++) {
        for (let j = 0; j < newShoppingCart[i].length; j++) {
          if (newShoppingCart[i][j].timeSlot === "已失效") {
            flag = false;
            wx.showModal({
              title: '提示',
              content: '购物车中包含失效物品!',
              success: function (res) {
                if (res.confirm) {
                  return;
                }
              }
            })
          }
        }
      }
      if (flag) {
        wx.navigateTo({
          url: "../order/order" + "?shoppingCart=" + JSON.stringify(newShoppingCart)
        });
      }
    }
  },
  delete(e) {
    let openId = wx.getStorageSync('openId');
    let shoppingCart = this.data.shoppingCart;
    let newShoppingCart = deepcopy(shoppingCart);
    let goodsArr = [];
    for (let i = 0; i < newShoppingCart.length; i++) {
      for (let j = 0; j < newShoppingCart[i].length; j++) {
        if (newShoppingCart[i][j].choice == 1) {
          let itemId = newShoppingCart[i][j]._id;
          goodsArr.push(itemId);
        }
      }
    }
    wx.request({
      method: "post",
      url: url + '/wxgoods/deleteGoodsArr',
      data: {
        openId,
        goodsArr
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
  },
  selectionTime(e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.request({
      method: "get",
      url: url + "/wxgoods/serviceById",
      data: {
        id: serviceId
      },
      success: ({
        data
      }) => {
        let {
          timeArr,
          timeAry
        } = conversionFormatTime(data.sur_date);
        this.setData({
          timeArr,
          timeAry
        });
      }
    });
  },
  toGoodsDetails(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../goodsdetails/goodsdetails?goodsId=${goodsId}`
    });
  },
  toserviceDetails(e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: `../servicedetails/servicedetails?serviceId=${serviceId}`
    });
  },
})