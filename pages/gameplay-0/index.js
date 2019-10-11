const app = getApp();

import {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  shareAppMessage,
} from '../../utils/index.js';
import { post } from '../../api/index';
import { OPERATORS, OPERATORS_HASH } from '../../constants/index.js';
import { RULE } from '../../constants/index.js';
const cardsAndRecommendSolution = generateCardsAndRecommendSolution();

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

  onShareAppMessage: shareAppMessage,

  _goProfile: function() {
    wx.navigateTo({ url: '/pages/index/index' });
  },

  _showRule: function() {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
      success: function(res) {},
    });
  },

  _selectOperator: function(e) {
    const { value } = e.currentTarget.dataset;
    const { selectedOperator } = this.data;

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    });
  },

  _showSolution: function() {
    wx.showModal({
      showCancel: false,
      title: '推荐算法',
      content: this.data.recommendSolution,
      success: function(res) {},
    });
  },

  _selectCard: function(e) {
    const { value, index, state } = e.currentTarget.dataset;
    const { cards, selectedOperator, selectedCard, initialCards } = this.data;

    if (state === 'disable') return;

    const nextState = {
      cards,
      selectedCard: { value, position: index },
    };

    nextState.cards[index].state = 'active';

    if (selectedCard !== null) {
      const selectCardPosition = selectedCard.position;
      if (selectedCard.position !== index) {
        Object.assign(nextState, {
          selectedCard: { value, position: index },
        });
        nextState.cards[selectCardPosition].state = 'normal';

        if (selectedOperator !== null) {
          const answer = calculate(selectedCard.value, value, selectedOperator);

          Object.assign(nextState, {
            selectedOperator: null,
            selectedCard: { value: answer, position: index },
          });

          nextState.cards[selectCardPosition].state = 'disable';
          nextState.cards[index] = {
            value: answer,
            state: 'active',
            alias: noDecimal(
              nextState.cards[selectCardPosition].alias,
              nextState.cards[index].alias,
              selectedOperator,
            ),
          };
        }
      } else {
        Object.assign(nextState, { selectedCard: null });
        nextState.cards[selectCardPosition].state = 'normal';
      }
    }

    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3;
    const openid = app.globalData.openid;

    if (isFinish && openid) {
      const isCorrect = nextState.selectedCard.value === 24;
      post('increaseAnswersCount', { openid, isCorrect });
      post('24-points/add_question', {
        openid,
        isCorrect,
        question: initialCards.map(x => x.value),
        gameplay: 'TYPE_0',
      });
    }

    if (isFinish && nextState.selectedCard.value === 24) {
      this._skip();
    } else {
      this.setData({ ...nextState, isFinish });
    }
  },

  _reset: function() {
    const resetCards = this.data.initialCards.map(x => ({
      value: x.value,
      alias: [x.value],
      state: 'normal',
    }));

    this.setData({
      cards: resetCards,
      selectedCard: null,
      selectedOperator: null,
      isFinish: false,
    });
  },

  _skip: function(e) {
    const { cards, recommendSolution } = generateCardsAndRecommendSolution();
    this.setData({
      cards,
      initialCards: [...cards],
      recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      isFinish: false,
    });
  },
});
