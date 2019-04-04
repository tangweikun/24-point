const app = getApp();
import { RULE, GAMEPLAY, AVATAR_URL } from '../../constants/index.js';
import { shareAppMessage } from '../../utils/index';

Page({
  data: {
    avatar: AVATAR_URL,
    rankingList: [],
  },

  onLoad: function() {
    this.setData({
      rankingList: app.globalData.rankingList1,
    });
  },

  onShareAppMessage: shareAppMessage,

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
});
