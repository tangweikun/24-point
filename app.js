//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.login({
      success: res => {
        wx.request({
          url: 'https://api.tangweikun.cn/createuser',
          method: 'post',
          data: {
            code: res.code,
            userInfo: {},
          },
          success: response => {
            this.globalData.openid = response.data.openid
          },
        })

        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
    })
  },
  globalData: {
    userInfo: null,
  },
})
