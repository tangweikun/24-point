const app = getApp()
const { BASE_URL } = require('../../constants/index.js')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorized: true,
    totalOfAnswers: '--',
    totalOfCorrectAnswers: '--',
    accuracy: '100%',
    challengeRanking: '--',
    bestRecord: '--',
    f: app.globalData.gameData,
    avatarUrl:
      'https://wx.qlogo.cn/mmopen/vi_32/eXrWeb45sjCs0Z0teC8WDU5VFdYGt5BAbYZOf0JicOSlK94BOWj6NgjUbCE1Adx6Kria0FVLxya3JkLn2DQicDpPA/132',
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/profile/index',
    }
  },

  onLoad: function() {
    if (app.globalData.userInfo && app.globalData.gameData) {
      const { avatarUrl = '' } = app.globalData.userInfo
      const { totalOfCorrectAnswers, totalOfAnswers } = app.globalData.gameData
      const accuracy =
        totalOfAnswers === undefined
          ? '-'
          : ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) + '%'

      this.setData({
        isAuthorized: true,
        type1Ranking: app.globalData.gameData.type1Ranking,
        type1Record: app.globalData.gameData.type1Record,
        type2Ranking: app.globalData.gameData.type2Ranking,
        type2Record: app.globalData.gameData.type2Record,
        avatarUrl,
        accuracy,
        totalOfAnswers,
      })
    } else {
      this.setData({ isAuthorized: false })
    }
  },

  getRanking: function() {
    const { openid } = app.globalData
    if (openid !== '') {
      wx.request({
        url: `${BASE_URL}/getRanking`,
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
    wx.request({
      url: `${BASE_URL}/getUserInfo`,
      method: 'post',
      data: {
        openid: app.globalData.openid,
      },
      success: response => {
        const {
          userInfo = {},
          totalOfCorrectAnswers = '--',
          totalOfAnswers = '--',
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
          challengeRanking,
          bestRecord,
          isAuthorized: true,
          accuracy,
          avatarUrl: userInfo.avatarUrl,
        })
      },
    })
  },

  bindGetUserInfo: function(e) {
    if (app.globalData.openid) {
      wx.request({
        url: `${BASE_URL}/updateUserInfo`,
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
      this.getRanking()
    }
  },

  onPullDownRefresh() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.refreshUserInfo()
          this.getRanking()
        }
      },
    })
    wx.stopPullDownRefresh()
  },
})
