const app = getApp();
import {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  generateLuckyTime,
  shareAppMessage,
} from '../../utils/index.js';
import { post } from '../../api/index';
import {
  OPERATORS,
  OPERATORS_HASH,
  AVATAR_URL,
  RIVAL,
} from '../../constants/index.js';

const cardsAndRecommendSolution = generateCardsAndRecommendSolution();
const luckyTime = generateLuckyTime(0);

Page({
  data: {
    isReady: false,
    luckyTime,
    reminder: 5,
    countdown: 60,
    myScore: 0,
    rivalScore: 0,
    myReward: '+0',
    rivalReward: '+0',
    result: '',
    countdownBeforeStart: 2,
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
    rivalUserInfo: {},
  },

  onShareAppMessage: shareAppMessage,

  onUnload: function() {
    // TODO: 添加离开页面事件
    this.setData({ onThisPage: false });
    if (!this.data.gameOver && this.data.isReady) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '由于您提前离开比赛,本次对战结果为【投降】',
        success: function(res) {},
      });

      const { myScore, rivalScore, rivalUserInfo } = this.data;
      const openid = app.globalData.openid;
      const userInfo = app.globalData.userInfo;

      post('24-points/add_battle', {
        openid,
        myScore,
        rivalScore,
        userInfo,
        result: '投降',
        rivalUserInfo,
      });
    }
  },

  onLoad: function() {
    const rivalUserInfo = RIVAL[Math.floor(Math.random() * 90)];
    if (app.globalData.userInfo) {
      this.setData({
        rivalUserInfo,
        myAvatarUrl: app.globalData.userInfo.avatarUrl,
      });
    } else {
      this.setData({ rivalUserInfo });
    }

    this.handleCountdownLookingRival();
  },

  handleCountdownLookingRival: function() {
    const randomTime = Math.random() * 1000 + 800;
    setTimeout(() => this._handleStart(), randomTime);
  },

  _updateLevel: function() {
    const { myScore, rivalScore } = this.data;

    const point = myScore === rivalScore ? 0 : myScore > rivalScore ? 1 : -1;
    wx.getStorage({
      key: 'level',
      success: function(res) {
        app.globalData.level = res.data + point;
        wx.setStorage({
          key: 'level',
          data: res.data + point,
        });
      },
    });
  },

  handleCountdownBeforeStart: function() {
    const {
      countdownBeforeStart,
      isStart,
      reminder,
      myScore,
      rivalScore,
      rivalUserInfo,
    } = this.data;
    if (isStart) return;

    const that = this;
    if (countdownBeforeStart < 2) {
      if (reminder === 0) {
        const result =
          myScore > rivalScore
            ? '胜利'
            : myScore === rivalScore
            ? '平局'
            : '失败';
        this.setData({ gameOver: true, result });
        this._updateLevel();
        const openid = app.globalData.openid;
        const userInfo = app.globalData.userInfo;
        post('24-points/add_battle', {
          openid,
          myScore,
          rivalScore,
          userInfo,
          result,
          rivalUserInfo,
        });
      } else {
        this._handleStart();
      }
    } else {
      this.setData({ countdownBeforeStart: countdownBeforeStart - 1 });
      setTimeout(function() {
        that.handleCountdownBeforeStart();
      }, 1000);
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
    } = this.data;

    if (!onThisPage || gameOver || !isStart) return;

    const that = this;
    if (countdown < 2) {
      this.setData({ isStart: false });
      this.handleCountdownBeforeStart();
    } else {
      if (luckyTime === 60 - countdown) {
        this.setData({
          rivalScore: rivalScore + 2,
          rivalReward: '+2',
          isStart: false,
        });
        this.handleCountdownBeforeStart();
      } else {
        this.setData({ countdown: countdown - 1 });
      }
    }

    setTimeout(function() {
      that.handleCountdown();
    }, 1000);
  },

  _handleStart: function() {
    this._skip();
    this.handleCountdown();
  },

  _selectOperator: function(e) {
    const { value } = e.currentTarget.dataset;
    const { selectedOperator } = this.data;

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    });
  },

  _selectCard: function(e) {
    const { value, index, state } = e.currentTarget.dataset;
    const {
      cards,
      selectedOperator,
      selectedCard,
      myScore,
      initialCards,
    } = this.data;

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
      post('increaseAnswersCount', {
        openid,
        isCorrect: nextState.selectedCard.value === 24,
      });
      post('24-points/add_question', {
        openid,
        isCorrect: nextState.selectedCard.value === 24,
        question: initialCards.map(x => x.value),
        gameplay: 'TYPE_3',
      });
    }

    if (isFinish) {
      this.setData({
        myScore:
          nextState.selectedCard.value === 24 ? myScore + 2 : myScore - 2,
        isStart: false,
        myReward: nextState.selectedCard.value === 24 ? '+2' : '-1',
      });

      this.handleCountdownBeforeStart();
    } else {
      this.setData({ ...nextState });
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
    });
  },

  _skip: function() {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      cards: newCards.cards,
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 60,
      luckyTime: generateLuckyTime(app.globalData.level),
      isStart: true,
      countdownBeforeStart: 2,
      reminder: this.data.reminder - 1,
      isReady: true,
      myReward: '+0',
      rivalReward: '+0',
    });
  },
});
