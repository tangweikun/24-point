const generateLuckyTime = level => {
  switch (level) {
    case 0:
      return Math.round(Math.random() * 20) + 10
    case 1:
      return Math.round(Math.random() * 25) + 10
    case 2:
      return Math.round(Math.random() * 30) + 10
    case 3:
      return Math.round(Math.random() * 40) + 10
    case 4:
      return Math.round(Math.random() * 45) + 10
    case 5:
      return Math.round(Math.random() * 50) + 10
    case 6:
      return Math.round(Math.random() * 50) + 15
    default:
      return Math.round(Math.random() * 40) + 10
  }
}

module.exports = {
  generateLuckyTime,
}
