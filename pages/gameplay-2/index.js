const app = getApp();
import {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  shareAppMessage,
} from '../../utils/index.js';
import { OPERATORS, OPERATORS_HASH } from '../../constants/index.js';
import { post } from '../../api/index';
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
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    isStart: false,
    countdown: 30,
    record: 0,
    gameOver: false,
    onThisPage: true,
  },

  onShareAppMessage: shareAppMessage,

  onUnload: function() {
    const { openid, userInfo } = app.globalData;
    const { gameOver, record } = this.data;

    if (!gameOver && record > 0) {
      post('24-points/add_challenge', {
        openid,
        userInfo,
        record,
        gameplay: 'TYPE_2',
      });
    }

    this.setData({ onThisPage: false });
  },

  onLoad: function() {
    this._handleStart();
  },

  countdown: function() {
    if (!this.data.onThisPage || this.data.gameOver) return;

    const that = this;
    const { openid, userInfo } = app.globalData;

    if (this.data.countdown < 2) {
      if (this.data.isStart) {
        const foo = this.data.record;

        this.openAlert(foo);
        post('24-points/add_question', {
          openid,
          isCorrect: false,
          question: this.data.initialCards.map(x => x.value),
          gameplay: 'TYPE_2',
        });

        post('24-points/add_challenge', {
          openid,
          userInfo,
          record: foo,
          gameplay: 'TYPE_2',
        });
      }
    } else {
      this.setData({ countdown: this.data.countdown - 1 });

      setTimeout(function() {
        that.countdown();
      }, 1000);
    }
  },

  _handleStart: function() {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      isStart: true,
      gameOver: false,
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 30,
      record: 0,
    });
    this.countdown();
  },

  _selectOperator: function(e) {
    const { value } = e.currentTarget.dataset;
    const { selectedOperator } = this.data;

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    });
  },

  _selectCard: function(e) {
    const { value, index } = e.currentTarget.dataset;
    const { cards, selectedOperator, selectedCard, initialCards } = this.data;
    if (cards[index].state === 'disable') return;

    const nextState = {
      cards,
      selectedCard: { value: cards[index].value, position: index },
    };
    nextState.cards[index].state = 'active';

    if (selectedCard !== null) {
      Object.assign(nextState, { selectedCard: null });
      nextState.cards[selectedCard.position].state = 'normal';

      if (selectedCard.position !== index) {
        Object.assign(nextState, {
          selectedCard: { value: cards[index].value, position: index },
        });
        nextState.cards[selectedCard.position].state = 'normal';

        if (selectedOperator !== null) {
          const answer = calculate(
            selectedCard.value,
            cards[index].value,
            selectedOperator,
          );

          Object.assign(nextState, {
            selectedOperator: null,
            selectedCard: { value: answer, position: index },
          });

          nextState.cards[selectedCard.position].state = 'disable';
          nextState.cards[index] = {
            value: answer,
            state: 'active',
            alias: noDecimal(
              nextState.cards[selectedCard.position].alias,
              nextState.cards[index].alias,
              selectedOperator,
            ),
          };
        }
      }
    }
    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3;

    const openid = app.globalData.openid;

    if (isFinish && openid !== '') {
      const isCorrect = nextState.selectedCard.value === 24;
      if (isCorrect) {
        this._skip();
        this.setData({ record: this.data.record + 1 });
      } else {
        const foo = this.data.record;
        this.openAlert(foo);
        post('24-points/add_challenge', {
          openid,
          userInfo: app.globalData.userInfo,
          record: foo,
          gameplay: 'TYPE_2',
        });

        this.setData({ isStart: false, gameOver: true });
      }

      post('increaseAnswersCount', { openid, isCorrect }).then(res => {
        this.setData({
          totalOfCorrectAnswers: res.totalOfCorrectAnswers,
          totalOfAnswers: res.totalOfAnswers,
        });
      });
      post('24-points/add_question', {
        openid,
        isCorrect,
        question: initialCards.map(x => x.value),
        gameplay: 'TYPE_2',
      });
    } else {
      this.setData({
        ...nextState,
      });
    }
  },

  _reset: function(e) {
    const resetCards = this.data.initialCards.map(x => ({
      value: x.value,
      alias: [x.value],
      state: 'normal',
    }));

    this.setData({
      cards: resetCards,
      selectedCard: null,
      selectedOperator: null,
    });
  },

  _skip: function(e) {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 30,
    });
  },

  openAlert: function(record) {
    this.setData({
      gameOver: true,
      isStart: false,
    });
  },
});
