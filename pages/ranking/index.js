const app = getApp()
const { RULE, GAMEPLAY, AVATAR_URL } = require('../../constants/index.js')

Page({
  data: {
    avatar: AVATAR_URL,
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

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },

  goNewPage: function(e) {
    const { url, ready } = e.currentTarget.dataset

    if (ready) {
      wx.navigateTo({ url })
    }
  },
})
