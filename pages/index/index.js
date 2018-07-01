const app = getApp()
const { RULE } = require('../../constants/index.js')

Page({
  data: {
    gamePlay: [
      {
        text: '过关斩将',
        url: '/pages/challenge/index',
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
        text: '随便玩玩',
        url: '/pages/home/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '你问我答',
        url: '/pages/solution/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '我的战绩',
        url: '/pages/profile/index',
        isReady: true,
        isHot: true,
      },
      {
        text: '王者对战',
        url: '',
        isReady: false,
        isHot: false,
      },
    ],
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res2) {
              app.globalData.userInfo = res2.userInfo
            },
          })
        }
      },
    })
  },

  showRule: function() {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
      success: function(res) {},
    })
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/home/index',
    }
  },

  goNewPage: function(e) {
    const { url, ready } = e.currentTarget.dataset

    if (ready) {
      wx.navigateTo({ url })
    }
  },
})
