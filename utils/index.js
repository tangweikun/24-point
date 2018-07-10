const { generateCardsAndRecommendSolution } = require('./generateCards')
const { noDecimal } = require('./fractional')
const { calculate } = require('./calculate')
const { generateLuckyTime } = require('./luckyTime')
const { recommendSolution } = require('./recommend-solution')

module.exports = {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  recommendSolution,
  generateLuckyTime,
}
