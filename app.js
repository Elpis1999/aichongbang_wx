//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        // const APP_ID = 'wxefda8370997008e9'; //输入小程序appid
        // const APP_SECRET = 'dfe2aacfb69bc9f4fbfa45ef2549216f'; //输入小程序app_secret
        // var OPEN_ID = '' //储存获取到openid
        // var SESSION_KEY = '' //储存获取到session_key

        // wx.request({
        //   url: 'https://api.weixin.qq.com/sns/jscode2session',
        //   data:{
        //     appid:APP_ID,
        //     secret:APP_SECRET,
        //     js_code:res.code,
        //     grant_type:'authorization_code'
        //   },
        //   method:'GET',
        //   success(res){
        //     console.log(res,"1");
        //   }
        // });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})