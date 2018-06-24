const { hasSolutionOf24Point } = require('./solution')

const randomNumber = () => Math.ceil(Math.random() * 13)
const generateCards = () => {
  while (true) {
    const values = [0, 1, 2, 3].map(x => randomNumber())
    if (hasSolutionOf24Point(values)) {
      return values.map(value => ({
        value,
        isDisabled: false,
        alias: [value],
        state: 'normal',
      }))
    }
  }
}

module.exports = {
  generateCards,
}
