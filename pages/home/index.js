const app = getApp()

Page({
  data: {
    gamePlay: [
      {
        text: '过关斩将',
        url: '/pages/challenge/index',
        isReady: true,
      },
      {
        text: '你问我答',
        url: '/pages/solution/index',
        isReady: true,
      },
      {
        text: '闯关模式',
        url: '',
        isReady: false,
      },
      {
        text: '王者对战',
        url: '',
        isReady: false,
      },
    ],
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/profile/index',
    }
  },

  goNewPage: function(e) {
    const { url, ready } = e.currentTarget.dataset

    if (ready) {
      wx.navigateTo({ url })
    }
  },
})
