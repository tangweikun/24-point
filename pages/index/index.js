//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    operators: ['+', '-', '*', '/'],
    currentOperator: null,
    currentCard: null,
    cards: [
      { value: Math.ceil(Math.random() * 13), isDisabled: false },
      { value: Math.ceil(Math.random() * 13), isDisabled: false },
      { value: Math.ceil(Math.random() * 13), isDisabled: false },
      { value: Math.ceil(Math.random() * 13), isDisabled: false },
    ],
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  selectCardOrOperator: function(e) {
    const { type, value, index } = e.currentTarget.dataset
    const { cards, currentOperator, currentCard } = this.data

    const nextState = { cards, currentCard }
    if (type === 'card') {
      if (currentCard === null) {
        nextState.currentCard = { value: cards[index].value, position: index }
      } else if (currentCard.position === index) {
        nextState.currentCard = null
      } else if (currentCard.position !== index) {
        if (currentOperator === null) {
          nextState.currentCard = { value: cards[index].value, position: index }
        } else {
          nextState.currentOperator = null
          const answer = util.calculate(
            currentCard.value,
            cards[index].value,
            currentOperator,
          )
          nextState.currentCard = { value: answer, position: index }
          nextState.cards[currentCard.position].isDisabled = true
          nextState.cards[index] = {
            value: answer,
            isDisabled: false,
          }
        }
      }
    } else {
      nextState.currentOperator = currentOperator !== value ? value : null
    }

    this.setData({ ...nextState })
  },

  reset: function(e) {
    this.setData({
      cards: [
        { value: Math.ceil(Math.random() * 13), isDisabled: false },
        { value: Math.ceil(Math.random() * 13), isDisabled: false },
        { value: Math.ceil(Math.random() * 13), isDisabled: false },
        { value: Math.ceil(Math.random() * 13), isDisabled: false },
      ],
      currentCard: null,
      currentOperator: null,
    })
  },
})
