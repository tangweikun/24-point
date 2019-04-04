const app = getApp();
import { formatTime, shareAppMessage } from '../../utils/index.js';
import { post } from '../../api/index';

Page({
  data: {
    battleList: [],
  },

  onShareAppMessage: shareAppMessage,

  onLoad: function() {
    const { openid, battleList } = app.globalData;
    this.setData({ battleList });
    if (openid) {
      post('getMyBattleList', { openid }).then(res => {
        app.globalData.battleList = res.map(x => ({
          ...x,
          createdAt: formatTime(x.createdAt),
        }));
      });
    }
  },
});
