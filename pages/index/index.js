const app = getApp()
const { RULE, GAMEPLAY } = require('../../constants/index.js')
const { post } = require('../../api/index')

Page({
  data: {
    isAuthorized: false,
    gamePlay: [
      {
        text: '排行榜',
        url: '/pages/ranking/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '随便玩玩',
        url: '/pages/gameplay-0/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '王者对战',
        url: '/pages/gameplay-3/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '过关斩将',
        url: '/pages/gameplay-2/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '分秒必争',
        url: '/pages/gameplay-1/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '对战历史',
        url: '/pages/battle-list/index',
        isReady: true,
        isHot: false,
      },
      // {
      //   text: '我的战绩',
      //   url: '/pages/profile/index',
      //   isReady: true,
      //   isHot: true,
      // },
    ],
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          app.globalData.isAuthorized = true
          this.setData({ isAuthorized: true })
          wx.getUserInfo({
            success: function(res2) {
              app.globalData.userInfo = res2.userInfo
            },
          })
        }
      },
    })
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },

  bindGetUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.isAuthorized = true
    if (app.globalData.openid) {
      post('updateUserInfo', {
        openid: app.globalData.openid,
        userInfo: e.detail.userInfo,
      })
    }
  },

  _showRule: function() {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
      success: function(res) {},
    })
  },

  _showLoginTip: function() {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '请先登录',
      success: function(res) {},
    })
  },

  _showGameplay: function() {
    wx.showModal({
      showCancel: false,
      title: '玩法',
      content: GAMEPLAY,
      success: function(res) {},
    })
  },

  _goNewPage: function(e) {
    const { url, ready } = e.currentTarget.dataset

    if (ready) {
      if (
        !this.data.isAuthorized &&
        [
          '/pages/gameplay-3/index',
          '/pages/profile/index',
          '/pages/gameplay-2/index',
          '/pages/gameplay-1/index',
          '/pages/battle-list/index',
        ].indexOf(url) !== -1
      ) {
        this._showLoginTip()
      } else {
        wx.navigateTo({ url })
      }
    }
  },
})
