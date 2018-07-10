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
const luckyTime = Math.floor(Math.random() * 40) + 10

Page({
  data: {
    isReady: false,
    luckyTime,
    reminder: 10,
    countdown: 60,
    myScore: 0,
    rivalScore: 0,
    myReward: '+0',
    rivalReward: '+0',
    result: '',
    countdownBeforeStart: 5,
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
    myAvatarUrl: AVATAR_URL,
  },

  onShareAppMessage: function(res) {
    return {
      title: '王者对战',
      path: '/pages/index/index',
    }
  },

  onUnload: function() {
    // TODO: 添加离开页面事件
    this.setData({ onThisPage: false })
  },

  onLoad: function() {
    this.handleCountdownLookingRival()
  },

  handleCountdownLookingRival: function() {
    const randomTime = Math.random() * 600 + 2000
    setTimeout(() => this._handleStart(), randomTime)
  },

  handleCountdownBeforeStart: function() {
    const {
      countdownBeforeStart,
      isStart,
      reminder,
      myScore,
      rivalScore,
    } = this.data
    if (isStart) return

    const that = this
    if (countdownBeforeStart < 2) {
      if (reminder === 0) {
        const result =
          myScore > rivalScore
            ? '胜利'
            : myScore === rivalScore
              ? '平局'
              : '失败'
        this.setData({ gameOver: true, result })
      } else {
        this._handleStart()
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
    } else {
      if (luckyTime === 60 - countdown) {
        this.setData({
          rivalScore: rivalScore + 2,
          rivalReward: '+2',
          isStart: false,
        })
        this.handleCountdownBeforeStart()
      } else {
        this.setData({ countdown: countdown - 1 })
      }
    }

    setTimeout(function() {
      that.handleCountdown()
    }, 1000)
  },

  _handleStart: function() {
    this._skip()
    this.handleCountdown()
  },

  _selectOperator: function(e) {
    const { value } = e.currentTarget.dataset
    const { selectedOperator } = this.data

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    })
  },

  _selectCard: function(e) {
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
        myReward: nextState.selectedCard.value === 24 ? '+2' : '-1',
      })

      this.handleCountdownBeforeStart()
    } else {
      this.setData({ ...nextState })
    }
  },

  _reset: function() {
    const resetCards = this.data.initialCards.map(x => ({
      value: x.value,
      alias: [x.value],
      state: 'normal',
    }))

    this.setData({
      cards: resetCards,
      selectedCard: null,
      selectedOperator: null,
    })
  },

  _skip: function() {
    const newCards = generateCardsAndRecommendSolution()
    this.setData({
      cards: newCards.cards,
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 60,
      luckyTime: Math.floor(Math.random() * 40) + 10,
      isStart: true,
      countdownBeforeStart: 5,
      reminder: this.data.reminder - 1,
      isReady: true,
      myReward: '+0',
      rivalReward: '+0',
    })
  },
})
