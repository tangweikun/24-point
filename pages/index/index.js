const app = getApp();
import { shareAppMessage } from '../../utils/index';
import { RULE, GAMEPLAY } from '../../constants/index.js';
import { post } from '../../api/index';

Page({
  data: {
    isAuthorized: false,
    gamePlay: [
      // {
      //   text: '随便玩玩',
      //   url: '/pages/gameplay-0/index',
      //   isReady: true,
      //   isHot: false,
      // },
      // {
      //   text: '排行榜',
      //   url: '/pages/ranking/index',
      //   isReady: true,
      //   isHot: false,
      // },
      // {
      //   text: '王者对战',
      //   url: '/pages/gameplay-3/index',
      //   isReady: true,
      //   isHot: false,
      // },
      {
        text: '过关斩将',
        url: '/pages/gameplay-2/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '分秒必争',
        url: '/pages/gameplay-1/index',
        isReady: true,
        isHot: false,
      },
      // {
      //   text: '对战历史',
      //   url: '/pages/battle-list/index',
      //   isReady: true,
      //   isHot: false,
      // },
      // {
      //   text: '我的战绩',
      //   url: '/pages/profile/index',
      //   isReady: true,
      //   isHot: true,
      // },
    ],
  },

  onLoad: function() {},

  onShareAppMessage: shareAppMessage,

  // bindGetUserInfo: function(e) {
  //   app.globalData.userInfo = e.detail.userInfo;
  //   app.globalData.isAuthorized = true;
  //   this.setData({ isAuthorized: true });
  //   if (app.globalData.openid) {
  //     post('updateUserInfo', {
  //       openid: app.globalData.openid,
  //       userInfo: e.detail.userInfo,
  //     });
  //   }
  // },

  _showRule: function() {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
      success: function(res) {},
    });
  },

  _showGameplay: function() {
    wx.showModal({
      showCancel: false,
      title: '玩法',
      content: GAMEPLAY,
      success: function(res) {},
    });
  },

  _goNewPage: function(e) {
    const { url, ready } = e.currentTarget.dataset;

    if (ready) {
      wx.navigateTo({ url });
    }
  },
});
