const app = getApp()
const { RULE, GAMEPLAY, AVATAR_URL } = require('../../constants/index.js')
const { shareAppMessage } = require('../../utils/index')

Page({
  data: {
    avatar: AVATAR_URL,
    rankingList: [],
  },

  onLoad: function() {
    this.setData({
      rankingList: app.globalData.rankingList2,
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

  onShareAppMessage: shareAppMessage,
})
