import { recommendSolution } from './recommend-solution';

const randomNumber = () => Math.ceil(Math.random() * 13);
const generateCardsAndRecommendSolution = () => {
  while (true) {
    const values = [0, 1, 2, 3].map(x => randomNumber());
    const rec = recommendSolution(...values);

    if (rec !== null) {
      return {
        cards: values.map(value => ({
          value,
          alias: [value],
          state: 'normal',
        })),
        recommendSolution: rec,
      };
    }
  }
};

module.exports = {
  generateCardsAndRecommendSolution,
};
