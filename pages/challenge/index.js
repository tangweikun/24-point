const app = getApp()
const { generateCards, noDecimal, calculate } = require('../../utils/index.js')

const defaultCards = generateCards()

Page({
  data: {
    operators: ['+', '-', '*', '/'],
    currentOperator: null,
    currentCard: null,
    cards: defaultCards,
    initialCards: [...defaultCards],
    isFinish: false,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    isStart: false,
    countdown: 10,
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

  countdown: function() {
    console.log('-----', this.data)
    const that = this

    if (this.data.countdown < 1 || !this.data.isStart) {
      this.setData({ isStart: false })
    } else {
      this.setData({
        countdown: this.data.countdown - 1,
      })
      setTimeout(function() {
        that.countdown()
      }, 1000)
    }
  },

  handleStart: function() {
    this.setData({ isStart: true, countdown: 10 })
    this.countdown()
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
      const isCorrect = nextState.currentCard.value === 24
      if (isCorrect) {
        this.skip()
      } else {
        this.skip()
        this.setData({ isStart: false })
      }

      this.openToast(isCorrect)
      wx.request({
        url: 'https://api.tangweikun.cn/increaseAnswersCount',
        method: 'post',
        data: {
          openid,
          isCorrect,
        },
        success: res => {
          this.setData({
            totalOfCorrectAnswers: res.data.totalOfCorrectAnswers,
            totalOfAnswers: res.data.totalOfAnswers,
          })
        },
      })
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

  openToast: function(isCorrect) {
    wx.showToast({
      title: isCorrect ? '回答正确' : '再接再厉',
      icon: 'success',
      duration: 1000,
    })
  },

  skip: function(e) {
    const newCards = generateCards()
    this.setData({
      cards: [...newCards],
      initialCards: [...newCards],
      currentCard: null,
      currentOperator: null,
      isFinish: false,
      countdown: 10,
    })
  },
})
