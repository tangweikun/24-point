const { filterRankingList, formatTime } = require('./utils/index.js')
const { post } = require('./api/index')

App({
  onLaunch: function() {
    wx.login({
      success: res => {
        post('createuser', { code: res.code }).then(res1 => {
          const { openid, userInfo } = res1
          this.globalData.openid = openid
          this.globalData.userInfo = userInfo

          post('getMyBattleList', { openid }).then(res2 => {
            this.globalData.battleList = res2.map(x => ({
              ...x,
              createdAt: formatTime(x.createdAt),
            }))
          })
        })
      },
    })

    post('getRankingList1').then(res => {
      this.globalData.rankingList1 = filterRankingList(res)
    })

    post('getRankingList2').then(res => {
      this.globalData.rankingList2 = filterRankingList(res)
    })

    const that = this
    wx.getStorage({
      key: 'level',
      success: function(res) {
        that.globalData.level = res.data
      },
      fail: function() {
        wx.setStorage({
          key: 'level',
          data: 6,
        })
      },
    })
  },

  globalData: {
    userInfo: null,
    gameData: null,
    openid: null,
    rankingList1: [],
    rankingList2: [],
    battleList: [],
    level: 6,
  },
})
