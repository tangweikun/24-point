const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorized: false,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    ranking: 0,
    accuracy: 100,
  },

  onLoad: function() {},

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },

  onShow: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.request({
            url: 'https://api.tangweikun.cn/getUserInfo',
            method: 'post',
            data: {
              openid: app.globalData.openid,
            },
            success: response => {
              const {
                userInfo,
                totalOfCorrectAnswers = '-',
                totalOfAnswers = '-',
                ranking = '-',
              } = response.data

              app.globalData.userInfo = userInfo
              this.setData({
                totalOfCorrectAnswers,
                totalOfAnswers,
                ranking,
                isAuthorized: true,
                accuracy:
                  ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) +
                  '%',
              })
            },
          })
        }
      },
    })
  },

  bindGetUserInfo: function(e) {
    wx.request({
      url: 'https://api.tangweikun.cn/updateUserInfo',
      method: 'post',
      data: {
        openid: app.globalData.openid,
        userInfo: e.detail.userInfo,
      },
      success: response => {
        console.log(response)
      },
    })
    this.setData({ isAuthorized: true })
  },
})
