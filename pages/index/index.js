const app = getApp()
const util = require('../../utils/util')
const fractional = require('../../utils/fractional')

const randomNumber = () => Math.ceil(Math.random() * 13)
const generateCards = () =>
  [0, 1, 2, 3].map(() => {
    const value = randomNumber()
    return { value, isDisabled: false, alias: [value], state: 'normal' }
  })

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    operators: ['+', '-', '*', '/'],
    currentOperator: null,
    currentCard: null,
    cards: generateCards(),
    isFinish: false,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
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
    this.setData({ userInfo: e.detail.userInfo, hasUserInfo: true })
  },

  selectOperator: function(e) {
    const { value } = e.currentTarget.dataset
    const { currentOperator } = this.data

    this.setData({ currentOperator: currentOperator !== value ? value : null })
  },

  selectCard: function(e) {
    const { value, index } = e.currentTarget.dataset
    const { cards, currentOperator, currentCard } = this.data
    if (cards[index].state === 'disable') return

    const nextState = {
      cards,
      currentCard: { value: cards[index].value, position: index },
    }
    nextState.cards[index].state = 'active'

    if (currentCard !== null) {
      Object.assign(nextState, { currentCard: null })
      nextState.cards[currentCard.position].state = 'normal'

      if (currentCard.position !== index) {
        Object.assign(nextState, {
          currentCard: { value: cards[index].value, position: index },
        })
        nextState.cards[currentCard.position].state = 'normal'

        if (currentOperator !== null) {
          const answer = util.calculate(
            currentCard.value,
            cards[index].value,
            currentOperator,
          )

          Object.assign(nextState, {
            currentOperator: null,
            currentCard: { value: answer, position: index },
          })
          nextState.cards[currentCard.position].isDisabled = true
          nextState.cards[currentCard.position].state = 'disable'
          nextState.cards[index] = {
            value: answer,
            isDisabled: false,
            state: 'active',
            alias: fractional.noDecimal(
              nextState.cards[currentCard.position].alias,
              nextState.cards[index].alias,
              currentOperator,
            ),
          }
        }
      }
    }
    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3

    const openid = app.globalData.openid
    if (isFinish && openid !== '') {
      wx.request({
        url: 'https://api.tangweikun.cn/increaseAnswersCount',
        method: 'post',
        data: {
          openid,
          isCorrect: nextState.currentCard.value === 24,
        },
        success: res => {
          this.setData({
            totalOfCorrectAnswers: res.data.totalOfCorrectAnswers,
            totalOfAnswers: res.data.totalOfAnswers,
          })
        },
      })
    }

    this.setData({
      ...nextState,
      isFinish,
    })
  },

  reset: function(e) {
    this.setData({
      cards: generateCards(),
      currentCard: null,
      currentOperator: null,
      isFinish: false,
    })
  },
})
