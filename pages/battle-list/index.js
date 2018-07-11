const app = getApp()

Page({
  data: {
    battleList: [],
  },

  onLoad: function() {
    this.setData({ battleList: app.globalData.battleList })
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },
})
