// pages/details/details.js
let {
  url
} = require("../../config/index");
let {
  formatTime
} = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    serviceInfo: {},
    imgUrls: [],
    select: 0,
    chooseSize: false, //弹出层
    chooseSizeBespoke: false, //弹出层
    animationData: {},
    animationDataBespoke: {},
    timeArr: [],
    timeAry: [],
    index: 0,
    serviceComment: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.show(options);
  },
  show(options) {
    let openId = wx.getStorageSync('openId');
    wx.request({
      method: "get",
      url: url + '/wxgoods/searchAllPetMaster',
      success: ({
        data
      }) => {
        let petMasters = data;
        wx.request({
          method: "get",
          url: url + "/wxgoods/serviceById",
          data: {
            id: options.serviceId
          },
          success: (res) => {
            let data = res.data;
            let arr = [];
            arr.push(`${url}/upload/${data.cover_map}`);
            let timeArr = [];
            let timeAry = [];
            let date = new Date();
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            let day = date.getDate().toString();
            let hours = date.getHours().toString();
            let minutes = date.getMinutes().toString();
            minutes = (hours * 60) + minutes;

            for (let k = 0; k < data.sur_date.length; k++) {
              for (let i = 0; i < petMasters.length; i++) {
                for (let j = 0; j < petMasters[i].reservationService.length; j++) {
                  if (data.sur_date[k] == petMasters[i].reservationService[j].sur_date && data._id == petMasters[i].reservationService[j]._id) {
                    data.sur_date.splice(k, 1);
                  }
                }
              }
            }

            for (let i = 0; i < data.sur_date.length; i++) {
              let tiem = data.sur_date[i].split("-");
              let timeHours = tiem[3].split(":")[0];
              let tiemMinutes = tiem[3].split(":")[1];
              tiemMinutes = (timeHours * 60) + tiemMinutes;
              console.log(parseInt(hours) < parseInt(timeHours));
              console.log(hours, timeHours);
              if (tiem[0] == year && tiem[1] == month && tiem[2] == day && parseInt(hours) < parseInt(timeHours)) {
                timeArr.push("今天" + tiem[3] + "-" + tiem[4]);
                timeAry.push(data.sur_date[i]);
              } else if (tiem[0] == year && tiem[1] == month && tiem[2] == parseInt(day) + 1 && hours < timeHours) {
                timeArr.push("明天" + tiem[3] + "-" + tiem[4]);
                timeAry.push(data.sur_date[i]);
              } else if (tiem[0] == year && tiem[1] == month && tiem[2] == parseInt(day) + 2 && hours < timeHours) {
                timeArr.push("后天" + tiem[3] + "-" + tiem[4]);
                timeAry.push(data.sur_date[i]);
              } else if (tiem[0] == year && tiem[1] == month && tiem[2] <= day && hours < timeHours) {
                timeArr.push(data.sur_date[i]);
                timeAry.push(data.sur_date[i]);
              }
            }

            this.setData({
              serviceInfo: data,
              imgUrls: arr,
              timeArr,
              timeAry
            });
          }
        });
      }
    });
    this.serviceReview(options.serviceId);
  },
  //获取服务评论
  serviceReview(serviceId) {
    wx.request({
      method: "get",
      url: url + "/wxgoods/goodsComment",
      data: {
        type: "service",
        value: serviceId
      },
      success: ({
        data
      }) => {
        this.setData({
          serviceComment: data
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
  bindPickerChange(e) {
    console.log(e)
    let index = e.detail.value;
    this.setData({
      index
    });
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


  //立即预约
  chooseSizeBespoke(e) {
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
      animationDataBespoke: animation.export(),
      // 改变view里面的Wx：if
      chooseSizeBespoke: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationDataBespoke: animation.export()
      })
    }, 200)
  },
  hideModalBespoke(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationDataBespoke: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationDataBespoke: animation.export(),
        chooseSizeBespoke: false
      })
    }, 200)
  },
  addToCart() {
    let openId = wx.getStorageSync('openId');
    let {
      serviceInfo,
      index,
      timeAry
    } = this.data;
    serviceInfo.sur_date = timeAry[index];
    if (serviceInfo.sur_date) {
      wx.request({
        method: "post",
        url: url + '/wxgoods/addService',
        data: {
          openId,
          service: serviceInfo
        },
        success: ({
          data
        }) => {
          if (data.status === 0) {
            wx.showToast({
              title: '添加失败购物车中已存在',
              duration: 2000
            })
            this.hideModal();
          } else {
            wx.showToast({
              title: '已添加至购物车',
              icon: 'success',
              duration: 2000
            })
            this.hideModal();
          }
        }
      });
    } else {
      wx.showToast({
        title: '请选择预约时间',
        duration: 2000
      })
    }
  },
  toShoppingCart() {
    wx.switchTab({
      url: "../../pages/shoppingcart/shoppingcart"
    });
  },
  immediateAppointment() {
    let {
      serviceInfo,
      index,
      timeAry
    } = this.data;
    serviceInfo.sur_date = timeAry[index];
    if (serviceInfo.sur_date) {
      serviceInfo.state = '未完成';
      let newShoppingCart = [
        [serviceInfo]
      ];
      wx.navigateTo({
        url: "../order/order" + "?shoppingCart=" + JSON.stringify(newShoppingCart)
      });
    } else {
      wx.showToast({
        title: '请选择预约时间',
        duration: 2000
      })
    }
  }
})