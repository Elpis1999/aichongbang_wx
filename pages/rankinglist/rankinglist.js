//index.js  
//获取应用实例  
let {
  url
} = require("../../config/index");
var app = getApp()
Page({
  data: {
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    hotGoods: [],
    newGoods: [],
    url
  },
  onLoad: function () {

    wx.request({
      url: url + "/wxgoods/newGoods",
      method: "get",
      success: (res) => {
        console.log(res.data);
        this.setData({
          newGoods: res.data.goods
        },function(){
          console.log(this.data.newGoods);
        });
      }
    });

    wx.request({
      url: url + "/wxgoods/hotGoods",
      method: "get",
      success: (res) => {
        this.setData({
          hotGoods: res.data.goods
        });
      }
    });

    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})