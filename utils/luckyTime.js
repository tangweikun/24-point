export const generateLuckyTime = level => {
  switch (level) {
    case 1:
      return Math.round(Math.random() * 60) + 40;
    case 2:
      return Math.round(Math.random() * 40) + 40;
    case 3:
      return Math.round(Math.random() * 40) + 35;
    case 4:
      return Math.round(Math.random() * 40) + 30;
    case 5:
      return Math.round(Math.random() * 40) + 25;
    case 6:
      return Math.round(Math.random() * 40) + 20;
    case 7:
      return Math.round(Math.random() * 40) + 10;
    case 8:
      return Math.round(Math.random() * 35) + 10;
    case 9:
      return Math.round(Math.random() * 30) + 10;
    case 10:
      return Math.round(Math.random() * 25) + 10;
    case 11:
      return Math.round(Math.random() * 20) + 10;
    case 12:
      return Math.round(Math.random() * 15) + 10;
    case 13:
      return Math.round(Math.random() * 10) + 10;
    case 14:
      return Math.round(Math.random() * 10) + 8;
    case 15:
      return Math.round(Math.random() * 8) + 8;
    case 16:
      return Math.round(Math.random() * 6) + 8;
    case 17:
      return Math.round(Math.random() * 6) + 7;
    case 18:
      return Math.round(Math.random() * 6) + 6;
    default:
      return Math.round(Math.random() * 40) + 25;
  }
};
