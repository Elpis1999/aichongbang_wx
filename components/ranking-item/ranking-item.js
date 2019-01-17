// components/ranking-item/ranking-item.js
let {
  url
} = require("../../config/index");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    url
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetails(event) {
      let id = event.currentTarget.dataset.goodsid;
      wx.navigateTo({
        url: "../goodsdetails/goodsdetails?" + "goodsId=" + id
      });
    }
  }
})