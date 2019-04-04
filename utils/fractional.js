export function noDecimal(arr1, arr2, operator) {
  const [firstInteger, firstNumerator = 0, firstDenominator = 1] = arr1;
  const [secondInteger, secondNumerator = 0, secondDenominator = 1] = arr2;
  const firstSign = Math.sign(firstInteger) || Math.sign(firstNumerator) || 1;
  const secondSign =
    Math.sign(secondInteger) || Math.sign(secondNumerator) || 1;

  if (operator === '+' || operator === '-') {
    const first =
      (Math.abs(firstNumerator) + Math.abs(firstInteger) * firstDenominator) *
      secondDenominator *
      firstSign;
    const second =
      (Math.abs(secondNumerator) +
        Math.abs(secondInteger) * secondDenominator) *
      firstDenominator *
      secondSign;
    const answer = calculate(first, second, operator);
    return fractionalSimplify(answer, firstDenominator * secondDenominator);
  }

  if (operator === '*') {
    const first =
      (firstNumerator + Math.abs(firstInteger) * firstDenominator) * firstSign;
    const second =
      (secondNumerator + Math.abs(secondInteger) * secondDenominator) *
      secondSign;
    return fractionalSimplify(
      first * second,
      firstDenominator * secondDenominator || 1,
    );
  }

  if (operator === '/') {
    const first =
      (Math.abs(firstNumerator) + Math.abs(firstInteger) * firstDenominator) *
      firstSign;
    const second =
      (Math.abs(secondNumerator) +
        Math.abs(secondInteger) * secondDenominator) *
        secondSign || 1;

    return fractionalSimplify(
      first * secondDenominator,
      second * firstDenominator,
    );
  }
}

const calculate = (num1, num2, operator) => {
  switch (operator) {
    case '+':
      return num1 + num2;

    case '-':
      return num1 - num2;

    case '*':
      return num1 * num2;

    case '/':
      return num1 / num2;

    default:
      return 0;
  }
};

function greatestCommonDivisor(a, b) {
  if (a > b) return gcd(a, b);
  return gcd(b, a);
}

const gcd = (bigNumber, smallNumber) => {
  const reminder = bigNumber % smallNumber;
  if (reminder === 0) return smallNumber;
  return gcd(smallNumber, reminder);
};

function fractionalSimplify(numerator, denominator) {
  if (numerator === 0) return [0];

  const absNumerator = Math.abs(numerator);
  const absDenominator = Math.abs(denominator);
  const sign = Math.sign(numerator) * Math.sign(denominator);
  const REMINDER = absNumerator % absDenominator;

  if (REMINDER === 0) return [(sign * absNumerator) / absDenominator];

  const GREATEST_COMMON_DIVISOR = greatestCommonDivisor(
    absNumerator,
    absDenominator,
  );
  const QUOTIENT = Math.floor(absNumerator / absDenominator);

  return [
    sign * QUOTIENT || 0,
    sign * (REMINDER / GREATEST_COMMON_DIVISOR),
    absDenominator / GREATEST_COMMON_DIVISOR,
  ];
}
