const { generateCardsAndRecommendSolution } = require('./generateCards');
const { noDecimal } = require('./fractional');
const { calculate } = require('./calculate');
const { generateLuckyTime } = require('./luckyTime');
const { recommendSolution } = require('./recommend-solution');
const { formatTime } = require('./formatTime');
const { shareAppMessage } = require('./shareAppMessage');

module.exports = {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  generateLuckyTime,
  recommendSolution,
  formatTime,
  shareAppMessage,
};
