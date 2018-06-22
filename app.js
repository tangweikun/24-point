//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res1 => {
        wx.getSetting({
          success: res2 => {
            if (res2.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res2 => {
                  wx.request({
                    url: 'https://api.tangweikun.cn/createuser',
                    method: 'post',
                    data: {
                      code: res1.code,
                      userInfo: res2.userInfo,
                    },
                    success: response => {
                      this.globalData.userInfo = res2.userInfo
                      this.globalData.openid = response.data.openid
                    },
                  })
                  // 可以将 res2 发送给后台解码出 unionId
                  // this.globalData.userInfo = res2.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res2)
                  }
                },
              })
            }
          },
        })
      },
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
              console.log('---->>', res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        }
      },
    })
  },
  globalData: {
    userInfo: null,
  },
})
