const app = getApp()

Page({
  data: {
    rankingList: [],
    tabIndex: 0,
  },

  onLoad: function() {
    this.setData({
      rankingList: app.globalData.rankingList1,
    })
  },

  _handleClickTab: function(e) {
    const { tabindex } = e.currentTarget.dataset
    if (tabindex !== this.data.tabIndex) {
      this.setData({
        tabIndex: tabindex,
        rankingList:
          tabindex === 0
            ? app.globalData.rankingList1
            : app.globalData.rankingList2,
      })
    }
  },

  onShareAppMessage: function() {
    return {
      title: '排行榜',
      path: '/pages/index/index',
    }
  },
})
