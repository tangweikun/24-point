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
    countdown: 31,
    record: 0,
    gameOver: false,
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.request({
            url: 'https://api.tangweikun.cn/getUserInfo',
            method: 'post',
            data: {
              openid: app.globalData.openid,
            },
            success: response => {
              const {
                userInfo,
                totalOfCorrectAnswers = '-',
                totalOfAnswers = '-',
                ranking = '-',
              } = response.data

              app.globalData.userInfo = userInfo
              this.setData({
                totalOfCorrectAnswers,
                totalOfAnswers,
                ranking,
                isAuthorized: true,
                accuracy:
                  ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) +
                  '%',
              })
            },
          })
        }
      },
    })
  },

  onShareAppMessage: function(res) {
    return {
      title: '限时挑战',
      path: '/pages/challenge/index',
    }
  },

  countdown: function() {
    const that = this
    const { openid, userInfo } = app.globalData

    if (this.data.countdown < 2) {
      if (this.data.isStart) {
        const foo = this.data.record

        this.openAlert(foo)
        wx.request({
          url: 'https://api.tangweikun.cn/addChallenge',
          method: 'post',
          data: {
            openid,
            userInfo,
            record: foo,
          },
          success: res => {
            console.log(res)
          },
        })
      }
    } else {
      this.setData({ countdown: this.data.countdown - 1 })

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
      countdown: 31,
      record: 0,
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
        this.setData({ record: this.data.record + 1 })
      } else {
        const foo = this.data.record
        this.openAlert(foo)
        wx.request({
          url: 'https://api.tangweikun.cn/addChallenge',
          method: 'post',
          data: {
            openid,
            userInfo: app.globalData.userInfo,
            record: foo,
          },
          success: res => {
            console.log(res)
          },
        })
        this.setData({ isStart: false, gameOver: true })
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
      countdown: 31,
    })
  },

  openAlert: function(record) {
    this.setData({
      gameOver: true,
      isStart: false,
    })
    // wx.showModal({
    //   content: '本次挑战得分: ' + record,
    //   showCancel: false,
    //   success: function(res) {},
    // })
    // this.setData({ isStart: false, record: 0 })
  },
})
