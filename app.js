const { BASE_URL } = require('./constants/index.js')
const { filterRankingList, formatTime } = require('./utils/index.js')

App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    wx.login({
      success: res => {
        wx.request({
          url: `${BASE_URL}/createuser`,
          method: 'post',
          data: { code: res.code },
          success: response => {
            const {
              openid,
              userInfo,
              totalOfCorrectAnswers,
              totalOfAnswers,
            } = response.data

            wx.request({
              url: `${BASE_URL}/getMyBattleList`,
              method: 'post',
              data: { openid },
              success: res => {
                this.globalData.battleList = res.data.map(x => ({
                  ...x,
                  createdAt: formatTime(x.createdAt),
                }))
              },
            })

            this.globalData.openid = openid
            this.globalData.userInfo = userInfo

            // wx.request({
            //   url: `${BASE_URL}/getRanking`,
            //   method: 'post',
            //   data: { openid: response.data.openid },
            //   success: res2 => {
            //     const {
            //       type1Ranking,
            //       type1Record,
            //       type2Ranking,
            //       type2Record,
            //     } = res2.data

            //     this.globalData.gameData = {
            //       type1Ranking,
            //       type1Record,
            //       type2Ranking,
            //       type2Record,
            //       totalOfCorrectAnswers,
            //       totalOfAnswers,
            //     }
            //   },
            // })
          },
        })

        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
    })

    wx.request({
      url: `${BASE_URL}/getRankingList1`,
      method: 'post',
      data: {},
      success: res => {
        this.globalData.rankingList1 = filterRankingList(res.data)
      },
    })

    wx.request({
      url: `${BASE_URL}/getRankingList2`,
      method: 'post',
      data: {},
      success: res => {
        this.globalData.rankingList2 = filterRankingList(res.data)
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
  },
})
