const { hasSolutionOf24Point } = require('./solution')
const { recommendSolution } = require('./recommend-solution')

const randomNumber = () => Math.ceil(Math.random() * 13)
const generateCards = () => {
  while (true) {
    const values = [0, 1, 2, 3].map(x => randomNumber())
    const rec = recommendSolution(...values)

    if (rec !== null) {
      return {
        cards: values.map(value => ({
          value,
          isDisabled: false,
          alias: [value],
          state: 'normal',
        })),
        recommendSolution: rec,
      }
    }
  }
}

module.exports = {
  generateCards,
}
