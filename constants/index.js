const { RIVAL } = require('./rival');

module.exports = {
  RIVAL,
  OPERATORS: ['+', '-', '*', '/'],
  OPERATORS_HASH: { '+': '+', '-': '-', '*': '×', '/': '÷' },
  AVATAR_URL:
    'https://wx.qlogo.cn/mmopen/vi_32/eXrWeb45sjCs0Z0teC8WDU5VFdYGt5BAbYZOf0JicOSlK94BOWj6NgjUbCE1Adx6Kria0FVLxya3JkLn2DQicDpPA/132',
  GAMEPLAY:
    '1.过关斩将: 每道题有30秒的解答时间,回答正确进入下一题.\n2.分秒必争: 在100秒内尽可能多答题,答对将获得一定的加时,答错则扣时.\n3.王者对战: 系统随机匹配玩家对战,每次出题10道,先答对的玩家加1分，答错扣1分,根据得分高低决定胜负.',
  RULE:
    '玩家得到4个1~13之间的数字，运用这个4个数字进行加减乘除四则运算来算出24',
  // BASE_URL: 'http://localhost:4000',
  BASE_URL: 'https://api-ghost.herokuapp.com',
};
