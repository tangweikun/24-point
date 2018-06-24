function countdown(that) {
  var EndTime = that.data.end_time || []
  var NowTime = new Date().getTime()
  var total_micro_second = EndTime - NowTime || []
  console.log('剩余时间：' + total_micro_second)
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second),
  })
  if (total_micro_second <= 0) {
    that.setData({
      clock: '已经截止',
    })
    //return;
  }
  setTimeout(function() {
    total_micro_second -= 1000
    countdown(that)
  }, 1000)
}

// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000)
  // 天数
  var day = Math.floor(second / 3600 / 24)
  // 小时
  var hr = Math.floor((second / 3600) % 24)
  // 分钟
  var min = Math.floor((second / 60) % 60)
  // 秒
  var sec = Math.floor(second % 60)
  return day + '天' + hr + '小时' + min + '分钟' + sec + '秒'
}

module.exports = {
  countdown,
  dateformat,
}
