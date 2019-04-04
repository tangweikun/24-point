const app = getApp();
import { recommendSolution, shareAppMessage } from '../../utils/index.js';

Page({
  data: {
    solution: '-',
    selectedCards: [],
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, '重置', '回退'],
  },

  onShareAppMessage: shareAppMessage,

  _selectCard: function(e) {
    const { value } = e.currentTarget.dataset;
    const { selectedCards } = this.data;

    if (value === '重置') {
      this.setData({
        selectedCards: [],
        solution: '-',
      });
      return;
    }

    if (value === '回退') {
      this.setData({
        selectedCards: selectedCards.slice(0, -1),
        solution: '-',
      });
      return;
    }

    if (selectedCards.length === 3) {
      const solution = recommendSolution(...selectedCards, value);
      this.setData({
        selectedCards: [...selectedCards, value],
        solution: solution || '无解',
      });
      return;
    }

    if (selectedCards.length < 3) {
      this.setData({
        selectedCards: [...selectedCards, value],
        solution: '-',
      });
    }
  },
});
