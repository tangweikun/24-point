const { post, get } = require('./api/index');

App({
  onLaunch: function() {},

  globalData: {
    userInfo: null,
    gameData: null,
    openid: null,
    rankingList1: [],
    rankingList2: [],
    battleList: [],
    level: 6,
  },
});
