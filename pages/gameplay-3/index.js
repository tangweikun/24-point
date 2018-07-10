const app = getApp()
const {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
} = require('../../utils/index.js')

const {
  OPERATORS,
  BASE_URL,
  OPERATORS_HASH,
  AVATAR_URL,
} = require('../../constants/index.js')

const cardsAndRecommendSolution = generateCardsAndRecommendSolution()
const luckyTime = Math.floor(Math.random() * 10) + 3

Page({
  data: {
    luckyTime,
    reminder: 8,
    countdown: 15,
    myScore: 0,
    rivalScore: 0,
    countdownBeforeStart: 7,
    isStart: true,
    gameOver: false,
    onThisPage: true,
    operators: OPERATORS,
    OPERATORS_HASH,
    selectedOperator: null,
    selectedCard: null,
    cards: cardsAndRecommendSolution.cards,
    initialCards: [...cardsAndRecommendSolution.cards],
    recommendSolution: cardsAndRecommendSolution.recommendSolution,
    rivalAvatarUrl: AVATAR_URL,
    myAvatarUrl:
      'https://wx.qlogo.cn/mmopen/vi_32/eXrWeb45sjCs0Z0teC8WDU5VFdYGt5BAbYZOf0JicOSlK94BOWj6NgjUbCE1Adx6Kria0FVLxya3JkLn2DQicDpPA/132',
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
  },

  onUnload: function() {
    // TODO: 添加离开页面事件
    this.setData({ onThisPage: false })
  },

  onLoad: function() {
    this.handleStart()
  },

  handleCountdownBeforeStart: function() {
    const { countdownBeforeStart, isStart, reminder } = this.data
    if (isStart) return

    const that = this
    if (countdownBeforeStart < 2) {
      if (reminder === 0) {
        this.setData({ gameOver: true })
      } else {
        this.handleStart()
      }
    } else {
      this.setData({ countdownBeforeStart: countdownBeforeStart - 1 })
      setTimeout(function() {
        that.handleCountdownBeforeStart()
      }, 1000)
    }
  },

  handleCountdown: function() {
    const {
      onThisPage,
      gameOver,
      countdown,
      luckyTime,
      rivalScore,
      isStart,
    } = this.data

    if (!onThisPage || gameOver || !isStart) return

    const that = this
    if (countdown < 2) {
      this.setData({ isStart: false })
      this.handleCountdownBeforeStart()
      // this.skip()
    } else {
      if (luckyTime === countdown) {
        // this.skip()
        this.setData({ rivalScore: rivalScore + 2, isStart: false })
        this.handleCountdownBeforeStart()
      } else {
        this.setData({ countdown: countdown - 1 })
      }
    }

    setTimeout(function() {
      that.handleCountdown()
    }, 1000)
  },

  handleStart: function() {
    this.skip()
    this.handleCountdown()
  },

  selectOperator: function(e) {
    const { value } = e.currentTarget.dataset
    const { selectedOperator } = this.data

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    })
  },

  selectCard: function(e) {
    const { value, index, state } = e.currentTarget.dataset
    const { cards, selectedOperator, selectedCard, myScore } = this.data

    if (state === 'disable') return

    const nextState = {
      cards,
      selectedCard: { value, position: index },
    }

    nextState.cards[index].state = 'active'

    if (selectedCard !== null) {
      const selectCardPosition = selectedCard.position
      if (selectedCard.position !== index) {
        Object.assign(nextState, {
          selectedCard: { value, position: index },
        })
        nextState.cards[selectCardPosition].state = 'normal'

        if (selectedOperator !== null) {
          const answer = calculate(selectedCard.value, value, selectedOperator)

          Object.assign(nextState, {
            selectedOperator: null,
            selectedCard: { value: answer, position: index },
          })

          nextState.cards[selectCardPosition].state = 'disable'
          nextState.cards[index] = {
            value: answer,
            state: 'active',
            alias: noDecimal(
              nextState.cards[selectCardPosition].alias,
              nextState.cards[index].alias,
              selectedOperator,
            ),
          }
        }
      } else {
        Object.assign(nextState, { selectedCard: null })
        nextState.cards[selectCardPosition].state = 'normal'
      }
    }

    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3
    const openid = app.globalData.openid

    if (isFinish && openid !== '') {
      wx.request({
        url: `${BASE_URL}/increaseAnswersCount`,
        method: 'post',
        data: {
          openid,
          isCorrect: nextState.selectedCard.value === 24,
        },
        success: res => {},
      })
    }

    if (isFinish) {
      this.setData({
        myScore:
          nextState.selectedCard.value === 24 ? myScore + 2 : myScore - 1,
        isStart: false,
      })

      this.handleCountdownBeforeStart()
    } else {
      this.setData({ ...nextState })
    }
  },

  reset: function(e) {
    this.setData({
      cards: [...this.data.initialCards],
      selectedCard: null,
      selectedOperator: null,
    })
  },

  skip: function() {
    const newCards = generateCardsAndRecommendSolution()
    this.setData({
      cards: newCards.cards,
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 15,
      luckyTime: Math.floor(Math.random() * 10) + 3,
      isStart: true,
      countdownBeforeStart: 7,
      reminder: this.data.reminder - 1,
    })
  },
})
