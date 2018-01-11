const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isConform(arr) {
  const operatorStack = []
  const numberStack = []
  const arr2 = []
  const helpArr2 = []

  for (let i = 0; i < arr.length; i++) {
    if (!isNaN(arr[i])) {
      arr2.push(arr[i])
    } else {
      if (arr[i] === '(') {
        helpArr2.push(arr[i])
      } else if (arr[i] === ')') {
        while (helpArr2[helpArr2.length - 1] !== '(') {
          arr2.push(helpArr2[helpArr2.length - 1])
          helpArr2.pop()
        }
        helpArr2.pop()
      } else if (priority[arr[i]] <= priority[helpArr2[helpArr2.length - 1]]) {
        while (helpArr2[helpArr2.length - 1] !== '(' && helpArr2.length) {
          arr2.push(helpArr2[helpArr2.length - 1])
          helpArr2.pop()
        }
        helpArr2.push(arr[i])
      } else {
        helpArr2.push(arr[i])
      }
    }
  }

  const ans = [...arr2, ...helpArr2.reverse()]
  const stack = []
  for (let k = 0; k < ans.length; k++) {
    if (isNaN(ans[k])) {
      const res = calculate(
        stack[stack.length - 2],
        stack[stack.length - 1],
        ans[k],
      )
      stack.pop()
      stack.pop()
      stack.push(res)
    } else {
      stack.push(ans[k])
    }
  }

  return stack[0] === 24
}

const priority = {
  '+': 0,
  '-': 0,
  '*': 1,
  '/': 1,
}

const calculate = (num1, num2, operator) => {
  switch (operator) {
    case '+':
      return num1 + num2

    case '-':
      return num1 - num2

    case '*':
      return num1 * num2

    case '/':
      return num1 / num2

    default:
      return 0
  }
}

module.exports = {
  formatTime: formatTime,
  isConform: isConform,
  calculate: calculate,
}
