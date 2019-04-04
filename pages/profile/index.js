const app = getApp();
import { post } from '../../api/index';
import { shareAppMessage } from '../../utils/index';

Page({
  data: {
    totalOfAnswers: '--',
    totalOfCorrectAnswers: '--',
    accuracy: '100%',
    rank: '-',
    avatarUrl:
      'https://wx.qlogo.cn/mmopen/vi_32/eXrWeb45sjCs0Z0teC8WDU5VFdYGt5BAbYZOf0JicOSlK94BOWj6NgjUbCE1Adx6Kria0FVLxya3JkLn2DQicDpPA/132',
  },

  onShareAppMessage: shareAppMessage,

  _setUserInfo: function() {
    const { avatarUrl = '' } = app.globalData.userInfo || {};
    const {
      totalOfCorrectAnswers,
      totalOfAnswers,
      rank = '--',
    } = app.globalData.gameData;
    const accuracy =
      totalOfAnswers === undefined
        ? '-'
        : ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) + '%';

    this.setData({
      avatarUrl,
      accuracy,
      totalOfCorrectAnswers,
      rank,
    });
  },

  onLoad: function() {
    if (
      app.globalData.gameData &&
      app.globalData.gameData.rank &&
      app.globalData.userInfo
    ) {
      this._setUserInfo();
    } else {
      setTimeout(() => this._setUserInfo(), 3000);
    }
  },

  refreshUserInfo() {
    post('getUserInfo', { openid: app.globalData.openid }).then(res => {
      const {
        userInfo = { avatarUrl: '' },
        totalOfCorrectAnswers = '--',
        totalOfAnswers = '--',
        rank = '--',
      } = res;

      const accuracy =
        totalOfAnswers === '--'
          ? '-'
          : ((100 * totalOfCorrectAnswers) / totalOfAnswers).toFixed(2) + '%';

      app.globalData.userInfo = userInfo;
      this.setData({
        totalOfCorrectAnswers,
        totalOfAnswers,
        accuracy,
        avatarUrl: userInfo.avatarUrl,
        rank,
      });

      app.globalData.gameData.totalOfAnswers = totalOfAnswers;
      app.globalData.gameData.totalOfCorrectAnswers = totalOfCorrectAnswers;
      app.globalData.gameData.rank = rank;
    });
  },

  bindGetUserInfo: function(e) {
    if (app.globalData.openid) {
      post('updateUserInfo', {
        openid: app.globalData.openid,
        userInfo: e.detail.userInfo,
      });

      this.refreshUserInfo();
    }
  },

  onPullDownRefresh() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.refreshUserInfo();
        }
      },
    });
    wx.stopPullDownRefresh();
  },
});
