// pages/allorder/allorder.js
let {
  url
} = require("../../config/index");
var QR = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    shopOrder: [],
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    hidden: false,
    placeholder: 'http://wxapp-union.com' //默认二维码生成文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize(); //动态设置画布大小
    var initUrl = this.data.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    this.show();
  },
  show() {
    let openId = wx.getStorageSync("openId");
    wx.request({
      method: "get",
      url: url + "/wxgoods/unfinishedOrder",
      data: {
        openId
      },
      success: ({
        data
      }) => {
        this.setData({
          shopOrder: data
        });
      }
    });
  },
  generateQRCode(e) {
    let {
      id,
      date
    } = e.currentTarget.dataset;
    console.log(id, date);
    this.setData({
      hidden: true
    });
    this.formSubmit(id, date);
  },
  closeQRcode() {
    this.setData({
      hidden: false
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
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (id, date) {
    let openId = wx.getStorageSync('openId');
    var that = this;
    let url = `${this.data.url}/ServiceValidation/index.html?openId=${openId}&serviceId=${id}&time=${date}`;
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000)

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
  toShop(e) {
    let storeId = e.currentTarget.dataset.storeid;
    wx.navigateTo({
      url: `../shop/shop?storeId=${storeId}`
    });
  },
  toserviceDetails(e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: `../servicedetails/servicedetails?serviceId=${serviceId}`
    });
  },
  nothing() {
    return;
  }
})