const app = getApp()
const { RULE, GAMEPLAY, AVATAR_URL } = require('../../constants/index.js')

Page({
  data: {
    avatar: AVATAR_URL,
    rankingList: [],
  },

  onLoad: function() {
    this.setData({
      rankingList: app.globalData.rankingList1,
    })
  },

  _showRule: function() {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
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

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },
})
