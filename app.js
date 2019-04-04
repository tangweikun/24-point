const { post, get } = require('./api/index');

App({
  onLaunch: function() {
    wx.login({
      success: res => {
        post('createuser', { code: res.code }).then(res1 => {
          const { openid, userInfo } = res1;
          this.globalData.openid = openid;
          this.globalData.userInfo = userInfo;

          post('getUserInfo', { openid }).then(res => {
            const { totalOfCorrectAnswers, totalOfAnswers, rank } = res;
            this.globalData.gameData = {
              totalOfCorrectAnswers,
              totalOfAnswers,
              rank,
            };
          });

          // post('getMyBattleList', { openid }).then(res2 => {
          //   this.globalData.battleList = res2.map(x => ({
          //     ...x,
          //     createdAt: formatTime(x.createdAt),
          //   }))
          // })
        });
      },
    });

    Promise.all([
      get('24-points/get_rank', { gameplay: 'TYPE_1' }),
      get('24-points/get_rank', { gameplay: 'TYPE_2' }),
    ]).then(([res1, res2]) => {
      this.globalData.rankingList1 = res1;
      this.globalData.rankingList2 = res2;
    });

    const that = this;
    wx.getStorage({
      key: 'level',
      success: function(res) {
        that.globalData.level = res.data;
      },
      fail: function() {
        wx.setStorage({
          key: 'level',
          data: 6,
        });
      },
    });
  },

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
