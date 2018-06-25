const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorized: false,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    ranking: 0,
    accuracy: '100%',
    challengeRanking: '-',
    bestRecord: '-',
  },

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '24点',
      path: '/pages/profile/index',
    }
  },

  onLoad: function() {
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
                userInfo = {},
                totalOfCorrectAnswers = '-',
                totalOfAnswers = '-',
                ranking = '-',
                challengeRanking = '-',
                bestRecord = '-',
              } = response.data

              const accuracy =
                totalOfAnswers === '-'
                  ? '-'
                  : ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(
                      2,
                    ) + '%'

              app.globalData.userInfo = userInfo
              this.setData({
                totalOfCorrectAnswers,
                totalOfAnswers,
                ranking,
                challengeRanking,
                bestRecord,
                isAuthorized: true,
                accuracy,
              })
            },
          })
        }
      },
    })
  },

  bindGetUserInfo: function(e) {
    if (app.globalData.openid) {
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
    }
  },

  onPullDownRefresh() {
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
                userInfo = {},
                totalOfCorrectAnswers = '-',
                totalOfAnswers = '-',
                ranking = '-',
                challengeRanking = '-',
                bestRecord = '-',
              } = response.data

              app.globalData.userInfo = userInfo
              this.setData({
                totalOfCorrectAnswers,
                totalOfAnswers,
                ranking,
                challengeRanking,
                bestRecord,
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
    wx.stopPullDownRefresh()
  },
})
