const filterRankingList = list => {
  let res = []
  let helper = []
  for (let item of list) {
    if (helper.indexOf(item.openid) === -1) {
      res.push(item)
      helper.push(item.openid)
    }
  }
  return res
}

module.exports = {
  filterRankingList,
}
