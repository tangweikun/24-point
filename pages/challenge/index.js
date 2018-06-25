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
    const newCards = generateCards()
    this.setData({
      isStart: true,
      gameOver: false,
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      currentCard: null,
      currentOperator: null,
      countdown: 31,
      record: 0,
    })
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
      currentCard: null,
      currentOperator: null,
    })
  },

  skip: function(e) {
    const newCards = generateCards()
    this.setData({
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      currentCard: null,
      currentOperator: null,
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
