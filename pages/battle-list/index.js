const app = getApp()
const { BASE_URL } = require('../../constants/index.js')
const { formatTime } = require('../../utils/index.js')

Page({
  data: {
    battleList: [],
  },

  onLoad: function() {
    this.setData({ battleList: app.globalData.battleList })
    const { openid } = app.globalData
    if (openid) {
      wx.request({
        url: `${BASE_URL}/getMyBattleList`,
        method: 'post',
        data: { openid },
        success: res => {
          app.globalData.battleList = res.data.map(x => ({
            ...x,
            createdAt: formatTime(x.createdAt),
          }))
        },
      })
    }
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },
})
