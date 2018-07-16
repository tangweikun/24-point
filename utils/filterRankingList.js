const filterRankingList = list => {
  let res = []
  let helper = []
  for (let item of list) {
    if (helper.indexOf(item.openid) === -1) {
      if (item.userInfo) {
        if (!item.userInfo.avatarUrl) {
          res.push({
            ...item,
            userInfo: {
              nickName: item.userInfo.nickName,
              avatarUrl:
                'http://img.mp.sohu.com/upload/20170722/ccbe3680bb3b4797b8a49bea401b2f9a_th.png',
            },
          })
        } else {
          res.push(item)
        }
      } else {
        res.push({
          ...item,
          userInfo: {
            nickName: '神秘人',
            avatarUrl:
              'http://img.mp.sohu.com/upload/20170722/ccbe3680bb3b4797b8a49bea401b2f9a_th.png',
          },
        })
      }

      helper.push(item.openid)
    }
  }
  return res
}

module.exports = {
  filterRankingList,
}
