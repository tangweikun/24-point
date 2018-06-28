const app = getApp()
const {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
} = require('../../utils/index.js')

const cardsAndRecommendSolution = generateCardsAndRecommendSolution()

Page({
  data: {
    operators: ['+', '-', '*', '/'],
    selectedOperator: null,
    selectedCard: null,
    cards: cardsAndRecommendSolution.cards,
    initialCards: [...cardsAndRecommendSolution.cards],
    recommendSolution: cardsAndRecommendSolution.recommendSolution,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    isStart: false,
    countdown: 120,
    record: 0,
    totalTime: 0,
    gameOver: false,
    onThisPage: true,
  },

  onUnload: function() {
    const { openid, userInfo } = app.globalData
    const { gameOver } = this.data
    if (!gameOver) {
      wx.request({
        url: 'https://api.tangweikun.cn/addChallenge',
        method: 'post',
        data: {
          openid,
          userInfo,
          record: this.data.record,
          totalTime: this.data.totalTime,
          gameplay: 'TYPE_1',
        },
        success: res => {
          console.log(res)
        },
      })
    }

    this.setData({ onThisPage: false })
  },

  onLoad: function() {
    this.handleStart()
  },

  onShareAppMessage: function(res) {
    return {
      title: '分秒必争',
      path: '/pages/gameplay-1/index',
    }
  },

  countdown: function() {
    if (!this.data.onThisPage || this.data.gameOver) return

    const that = this
    const { openid, userInfo } = app.globalData

    if (this.data.countdown < 2) {
      if (this.data.isStart) {
        const foo = this.data.record
        const bar = this.data.totalTime

        this.openAlert()
        wx.request({
          url: 'https://api.tangweikun.cn/addChallenge',
          method: 'post',
          data: {
            openid,
            userInfo,
            record: foo,
            totalTime: bar,
            gameplay: 'TYPE_1',
          },
          success: res => {
            console.log(res)
          },
        })
      }
    } else {
      this.setData({
        countdown: this.data.countdown - 1,
        totalTime: this.data.totalTime + 1,
      })

      setTimeout(function() {
        that.countdown()
      }, 1000)
    }
  },

  handleStart: function() {
    const newCards = generateCardsAndRecommendSolution()
    this.setData({
      isStart: true,
      gameOver: false,
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 120,
      record: 0,
      totalTime: 0,
    })
    this.countdown()
  },

  selectOperator: function(e) {
    const { value } = e.currentTarget.dataset
    const { selectedOperator } = this.data

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    })
  },

  selectCard: function(e) {
    const { value, index } = e.currentTarget.dataset
    const { cards, selectedOperator, selectedCard } = this.data
    if (cards[index].state === 'disable') return

    const nextState = {
      cards,
      selectedCard: { value: cards[index].value, position: index },
    }
    nextState.cards[index].state = 'active'

    if (selectedCard !== null) {
      Object.assign(nextState, { selectedCard: null })
      nextState.cards[selectedCard.position].state = 'normal'

      if (selectedCard.position !== index) {
        Object.assign(nextState, {
          selectedCard: { value: cards[index].value, position: index },
        })
        nextState.cards[selectedCard.position].state = 'normal'

        if (selectedOperator !== null) {
          const answer = calculate(
            selectedCard.value,
            cards[index].value,
            selectedOperator,
          )

          Object.assign(nextState, {
            selectedOperator: null,
            selectedCard: { value: answer, position: index },
          })

          nextState.cards[selectedCard.position].state = 'disable'
          nextState.cards[index] = {
            value: answer,
            state: 'active',
            alias: noDecimal(
              nextState.cards[selectedCard.position].alias,
              nextState.cards[index].alias,
              selectedOperator,
            ),
          }
        }
      }
    }
    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3

    const openid = app.globalData.openid

    if (isFinish && openid !== '') {
      const isCorrect = nextState.selectedCard.value === 24
      if (isCorrect) {
        this.skip()
        this.setData({
          record: this.data.record + 1,
          countdown: this.data.countdown + 10,
        })
      } else {
        const foo = this.data.record
        const bar = this.data.totalTime
        this.skip()
      }

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
      })
    }
  },

  reset: function(e) {
    this.setData({
      cards: [...this.data.initialCards],
      selectedCard: null,
      selectedOperator: null,
    })
  },

  skip: function(e) {
    const newCards = generateCardsAndRecommendSolution()
    this.setData({
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
    })
  },

  openAlert: function(record) {
    this.setData({
      gameOver: true,
      isStart: false,
    })
  },
})
