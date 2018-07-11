const { generateCardsAndRecommendSolution } = require('./generateCards')
const { noDecimal } = require('./fractional')
const { calculate } = require('./calculate')
const { generateLuckyTime } = require('./luckyTime')
const { recommendSolution } = require('./recommend-solution')
const { filterRankingList } = require('./filterRankingList')
const { formatTime } = require('./formatTime')

module.exports = {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  filterRankingList,
  generateLuckyTime,
  recommendSolution,
  formatTime,
}
