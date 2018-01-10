//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    expression: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      const randomNumber = () => Math.ceil(Math.random() * 13)
      const generateCards = () => [
        { value: randomNumber(), isDisabled: false },
        { value: randomNumber(), isDisabled: false },
        { value: randomNumber(), isDisabled: false },
        { value: randomNumber(), isDisabled: false },
      ]
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        cards: generateCards(),
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        },
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  selectCardOrOperator: function(e) {
    console.log(e, '====')
    const cards = this.data.cards
    cards[e.currentTarget.dataset.index].isDisabled = true
    this.setData({
      expression: this.data.expression + e.currentTarget.dataset.value,
      cards,
    })
  },
})
