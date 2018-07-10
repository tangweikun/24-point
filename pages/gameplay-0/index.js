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
} = require('../../constants/index.js')

const cardsAndRecommendSolution = generateCardsAndRecommendSolution()

Page({
  data: {
    operators: OPERATORS,
    OPERATORS_HASH,
    selectedOperator: null,
    selectedCard: null,
    cards: cardsAndRecommendSolution.cards,
    initialCards: [...cardsAndRecommendSolution.cards],
    recommendSolution: cardsAndRecommendSolution.recommendSolution,
    isFinish: false,
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
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
    const { cards, selectedOperator, selectedCard } = this.data

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

    if (isFinish && nextState.selectedCard.value === 24) {
      this._skip()
    } else {
      this.setData({ ...nextState, isFinish })
    }
  },

  _reset: function(e) {
    const resetCards = this.data.initialCards.map(x => ({
      value: x.value,
      alias: [x.value],
      state: 'normal',
    }))

    this.setData({
      cards: resetCards,
      selectedCard: null,
      selectedOperator: null,
      isFinish: false,
    })
  },

  _skip: function(e) {
    const newCards = generateCardsAndRecommendSolution()
    this.setData({
      cards: newCards.cards,
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      isFinish: false,
    })
  },
})
