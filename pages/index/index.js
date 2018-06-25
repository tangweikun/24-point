const app = getApp()
const { generateCards, noDecimal, calculate } = require('../../utils/index.js')

const defaultCards = generateCards()

Page({
  data: {
    operators: ['+', '-', '*', '/'],
    currentOperator: null,
    currentCard: null,
    cards: defaultCards.cards,
    initialCards: [...defaultCards.cards],
    recommendSolution: defaultCards.recommendSolution,
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

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },

  onLoad: function() {},

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
          const answer = calculate(
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
            alias: noDecimal(
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

    if (isFinish && nextState.currentCard.value === 24) {
      this.skip()
    } else {
      this.setData({
        ...nextState,
        isFinish,
      })
    }
  },

  reset: function(e) {
    this.setData({
      cards: [...this.data.initialCards],
      currentCard: null,
      currentOperator: null,
      isFinish: false,
    })
  },

  skip: function(e) {
    const newCards = generateCards()
    this.setData({
      cards: newCards.cards,
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      currentCard: null,
      currentOperator: null,
      isFinish: false,
    })
  },
})
