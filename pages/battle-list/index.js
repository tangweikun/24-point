const app = getApp()
const { formatTime, shareAppMessage } = require('../../utils/index.js')
const { post } = require('../../api/index')

Page({
  data: {
    battleList: [],
  },

  onShareAppMessage: shareAppMessage,

  onLoad: function() {
    const { openid, battleList } = app.globalData
    this.setData({ battleList })
    if (openid) {
      post('getMyBattleList', { openid }).then(res => {
        app.globalData.battleList = res.map(x => ({
          ...x,
          createdAt: formatTime(x.createdAt),
        }))
      })
    }
  },
})
