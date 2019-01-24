// pages/details/details.js
let {
  url
} = require("../../config/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    goodsInfo: {},
    imgUrls: [],
    select: 0,
    chooseSize: false, //弹出层
    chooseSizePurchase: false,
    animationData: {},
    animationDataPurchase: {},
    number: 1,
    commodityReview: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      method: "get",
      url: url + "/wxgoods/goodsById",
      data: {
        id: options.goodsId
      },
      success: ({
        data
      }) => {
        let arr = [];
        arr.push(`${url}/upload/${data.bigpic}`);
        arr.push(`${url}/upload/${data.smallpic}`);
        console.log(data);
        this.setData({
          goodsInfo: data,
          imgUrls: arr
        });
      }
    });
    this.loadComment(options.goodsId);
  },

  //获取商品的评论
  loadComment(goodsId) {
    wx.request({
      method: "get",
      url: url + "/wxgoods/goodsComment",
      data: {
        type: "goods",
        value: goodsId
      },
      success: ({
        data
      }) => {
        console.log(data, '商品评论');
        this.setData({
          commodityReview: data
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
  tabDetails() {
    this.setData({
      select: 0
    });
  },
  tabComment() {
    this.setData({
      select: 1
    });
  },
  addToCart() {
    let openId = wx.getStorageSync('openId');
    let goodsInfo = { ...this.data.goodsInfo};
    goodsInfo.purchaseQuantity = this.data.number;
    goodsInfo.subtotal = (goodsInfo.purchaseQuantity * this.data.goodsInfo.saleprice).toFixed(2);
    wx.request({
      method: "post",
      url: url + "/wxgoods/addGoods",
      data: {
        openId,
        goods: goodsInfo
      },
      success: () => {
        wx.showToast({
          title: '已添加至购物车',
          icon: 'success',
          duration: 2000
        })
        this.hideModal();
      }
    });
  },
  toShoppingCart() {
    wx.switchTab({
      url: "../../pages/shoppingcart/shoppingcart"
    });
  },
  //进入店铺
  enterShop() {
    let storeId = this.data.goodsInfo.store._id;
    wx.navigateTo({
      url: `../shop/shop?storeId=${storeId}`
    });
  },
  //直接购买
  directPurchase() {
    let goodsInfo = { ...this.data.goodsInfo
    };
    let number = this.data.number;
    goodsInfo.purchaseQuantity = number;
    goodsInfo.subtotal = (goodsInfo.saleprice * number).toFixed(2);
    let newShoppingCart = [
      [goodsInfo]
    ];
    wx.navigateTo({
      url: "../order/order" + "?shoppingCart=" + JSON.stringify(newShoppingCart)
    });
  },
  //加入购物车
  chooseSize(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  changeNumber(e) {
    this.setData({
      number: e.detail
    }, function () {
      console.log(this.data.number);
    });
  },

  //立即购买
  chooseSizePurchase(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationDataPurchase: animation.export(),
      // 改变view里面的Wx：if
      chooseSizePurchase: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationDataPurchase: animation.export()
      })
    }, 200)
  },
  hideModalPurchase(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationDataPurchase: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationDataPurchase: animation.export(),
        chooseSizePurchase: false
      })
    }, 200)
  },
})