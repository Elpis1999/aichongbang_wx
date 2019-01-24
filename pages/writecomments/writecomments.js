// pages/writecomments/writecomments.js
let {
  url
} = require("../../config/index");
let newOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url,
    user: {},
    text: "",
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    newOptions = options;
    this.show();
  },
  show() {
    wx.getUserInfo({
      success: (e) => {
        console.log(e);
        this.setData({
          user: e.userInfo
        });
      }
    })
  },
  input(e) {
    let {
      value
    } = e.detail;
    this.setData({
      text: value
    });
  },
  addPicture() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: url + '/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: (res) => {
            let imgName = res.data;
            let images = [...this.data.images, imgName];
            this.setData({
              images
            });
          }
        })
      }
    })
  },
  comment() {
    let {
      nickName,
      avatarUrl
    } = this.data.user;
    let content = this.data.text;
    let images = this.data.images;
    let type = newOptions.type;
    let value = newOptions.id;
    wx.request({
      method: "post",
      url: url + '/wxgoods/addComment',
      data: {
        nickName,
        avatarUrl,
        content,
        images,
        type,
        value
      },
      success: () => {
        wx.showToast({
          title: '发表成功',
          icon: 'success',
          duration: 1000,
          success: () => {
            setTimeout(function () {
              wx.navigateBack({
                url: "../allorder/allorder"
              });
            }, 1500);
          }
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

  }
})