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
    isFinish: false,
  },

  onShareAppMessage: function(res) {
    return {
      title: '24点',
      path: '/pages/index/index',
    }
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
    console.log(this.data)
    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3

    const openid = app.globalData.openid
    if (isFinish && openid !== '') {
      wx.request({
        url: 'https://api.tangweikun.cn/increaseAnswersCount',
        method: 'post',
        data: {
          openid,
          isCorrect: nextState.selectedCard.value === 24,
        },
        success: res => {
          console.log(res)
        },
      })
    }

    if (isFinish && nextState.selectedCard.value === 24) {
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
      selectedCard: null,
      selectedOperator: null,
      isFinish: false,
    })
  },

  skip: function(e) {
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
