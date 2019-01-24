// pages/my/my.js
let {
  url,
  APP_SECRET,
  APP_ID
} = require("../../config/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    dogFood: [],
    catFood: [],
    shearing: [],
    bathe: [],
    url,
    nearestShop: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: (res) => {
    //     const latitude = res.latitude
    //     const longitude = res.longitude

    //     wx.request({
    //       url: 'https://api.map.baidu.com/geocoder/v2/?ak=1PZH3APruxDvNkbQheag4vXntKZlF6Bu&location=' + latitude + "," + longitude + "&output=json",
    //       method: "get",
    //       success: (res) => {
    //         this.setData({
    //           address: res.data.result.formatted_address
    //         });
    //       }
    //     })
    //   }
    // });


    this.nearestDistance();

    wx.request({
      url: url + "/wxgoods/indexGoods",
      method: "get",
      data: {
        type: "supp_gd_type",
        value: "狗粮"
      },
      success: (res) => {
        this.setData({
          dogFood: res.data
        });
      }
    });
    wx.request({
      url: url + "/wxgoods/indexGoods",
      method: "get",
      data: {
        type: "supp_gd_type",
        value: "猫粮"
      },
      success: (res) => {
        this.setData({
          catFood: res.data
        });
      }
    });
    wx.request({
      url: url + "/wxgoods/indexService",
      method: "get",
      data: {
        type: "sur_name",
        value: "剪毛"
      },
      success: (res) => {
        this.setData({
          bathe: res.data
        });
      }
    });
    wx.request({
      url: url + "/wxgoods/indexService",
      method: "get",
      data: {
        type: "sur_name",
        value: "洗澡"
      },
      success: (res) => {
        this.setData({
          shearing: res.data
        });
      }
    });
    //获取用户信息并注册进数据库
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res,"*********************************");
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: ({
            data
          }) => {
            console.log(data,"-------------------------------");
            let openId = data.openid;
            wx.setStorage({
              key: 'openId',
              data: openId
            })
            wx.getUserInfo({
              success: (e) => {
                let {
                  nickName,
                  avatarUrl,
                  country,
                  province,
                  city
                } = e.userInfo;
                wx.request({
                  method: "post",
                  url: url + "/wxgoods/addPetMaster",
                  data: {
                    pm_name: "",
                    pm_phone: "",
                    pm_nickname: nickName,
                    pm_vipcard: "",
                    pm_pic: avatarUrl,
                    pm_area: country + "-" + province + "-" + city,
                    pm_address: [],
                    pm_integral: "",
                    pm_ownpet: [],
                    openId
                  },
                  success:()=>{
                    console.log("进来了");
                  }
                });
              }
            })
          }
        });
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
  toStoreList() {
    wx.navigateTo({
      url: "../storeList/storeList"
    });
  },
  goShoppingCart(e) {
    wx.switchTab({
      url: "../shoppingcart/shoppingcart"
    });
  },
  toGoods() {
    wx.navigateTo({
      url: "../goods/goods"
    });
  },
  toServer() {
    wx.navigateTo({
      url: "../service/service"
    });
  },
  toRankingList() {
    wx.navigateTo({
      url: "../rankinglist/rankinglist"
    });
  },
  toSearch(e) {
    wx.navigateTo({
      url: "../search/search"
    });
  },
  nearestDistance() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          method: "get",
          url: url + '/wxgoods/searchShopByLL',
          data: {
            latitude,
            longitude
          },
          success: ({
            data
          }) => {
            this.setData({
              nearestShop: data
            });
          }
        });
      }
    })
  },
  consultMap() {
    let {
      latitude,
      longitude
    } = this.data.nearestShop;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  }
})