const app = getApp()

Page({
  data: {
    rankingList1: [],
    rankingList2: [],
    myRankInfo1: null,
    myRankInfo2: null,
    myRank1: null,
    myRank2: null,
    tabIndex: 1,
  },

  _setRanking: function() {
    const { rankingList1, rankingList2, openid } = app.globalData
    const myRankInfo1 = rankingList1.find(x => x.openid === openid) || null
    const myRankInfo2 = rankingList2.find(x => x.openid === openid) || null
    const myRank1 = rankingList1.findIndex(x => x.openid === openid) || null
    const myRank2 = rankingList1.findIndex(x => x.openid === openid) || null

    this.setData({
      rankingList1,
      rankingList2,
      myRankInfo1,
      myRankInfo2,
      myRank1,
      myRank2,
    })
  },

  onLoad: function() {
    const { rankingList1, rankingList2 } = app.globalData
    if (rankingList1.length === 0 || rankingList2.length === 0) {
      setTimeout(() => this._setRanking(), 1000)
    } else {
      this._setRanking()
    }
  },

  _handleClickTab: function(e) {
    const { tabindex } = e.currentTarget.dataset
    if (tabindex !== this.data.tabIndex) {
      this.setData({ tabIndex: tabindex })
    }
  },

  onShareAppMessage: function() {
    return {
      title: '排行榜',
      path: '/pages/index/index',
    }
  },
})
