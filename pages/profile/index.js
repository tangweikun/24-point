const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorized: false,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    ranking: 0,
    accuracy: '100%',
    challengeRanking: '--',
    bestRecord: '--',
    type1Ranking: '--',
    type1Record: 0,
    type2Ranking: '--',
    type2Record: 0,
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/profile/index',
    }
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.refreshUserInfo()
        }
      },
    })
  },

  getRanking: function() {
    const { openid } = app.globalData
    if (openid !== '') {
      wx.request({
        url: 'https://api.tangweikun.cn/getRanking',
        method: 'post',
        data: {
          openid: app.globalData.openid,
        },
        success: response => {
          const {
            type1Ranking,
            type1Record,
            type2Ranking,
            type2Record,
          } = response.data
          this.setData({
            type1Ranking,
            type1Record,
            type2Ranking,
            type2Record,
          })
        },
      })
    }
  },

  refreshUserInfo() {
    this.getRanking()

    wx.request({
      url: 'https://api.tangweikun.cn/getUserInfo',
      method: 'post',
      data: {
        openid: app.globalData.openid,
      },
      success: response => {
        const {
          userInfo = {},
          totalOfCorrectAnswers = '--',
          totalOfAnswers = '--',
          ranking = '--',
          challengeRanking = '--',
          bestRecord = '--',
        } = response.data

        const accuracy =
          totalOfAnswers === '--'
            ? '-'
            : ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) + '%'

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
      this.refreshUserInfo()
    }
  },

  onPullDownRefresh() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.refreshUserInfo()
        }
      },
    })
    wx.stopPullDownRefresh()
  },
})
