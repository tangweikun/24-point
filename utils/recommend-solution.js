const operator = ['-', '+', '/', '*'];

function calculate(f, m, n) {
  if (f == 3) return m * n;
  if (f == 2) return m / n;
  if (f == 1) return m + n;
  if (f == 0) return m - n;
}

export function recommendSolution(i1, i2, i4, i8) {
  var n = 1;
  const b = [0, i1, i2, 0, i4, 0, 0, 0, i8];
  let k = 0;
  let res = '';
  let m = 0;

  for (let i1 = 1; i1 <= 8; i1 *= 2)
    for (let i2 = 1; i2 <= 8; i2 *= 2)
      for (let i3 = 1; i3 <= 8; i3 *= 2)
        for (let i4 = 1; i4 <= 8; i4 *= 2) {
          if ((i1 | i2 | i3 | i4) != 0xf) continue;
          for (let f1 = 0; f1 <= 3; f1++)
            for (let f2 = 0; f2 <= 3; f2++)
              for (let f3 = 0; f3 <= 3; f3++) {
                m = calculate(
                  f3,
                  calculate(f2, calculate(f1, b[i1], b[i2]), b[i3]),
                  b[i4],
                );
                if (Math.abs(m - 24) < 1e-5) {
                  res +=
                    '((' +
                    b[i1] +
                    operator[f1] +
                    b[i2] +
                    ')' +
                    operator[f2] +
                    b[i3] +
                    ')' +
                    operator[f3] +
                    b[i4];

                  if (n !== 0 && ++k >= n) return res;
                }

                m = calculate(
                  f1,
                  b[i1],
                  calculate(f3, calculate(f2, b[i2], b[i3]), b[i4]),
                );
                if (Math.abs(m - 24) < 1e-5) {
                  res +=
                    b[i1] +
                    operator[f1] +
                    '((' +
                    b[i2] +
                    operator[f2] +
                    b[i3] +
                    ')' +
                    operator[f3] +
                    b[i4] +
                    ')';

                  if (n !== 0 && ++k >= n) return res;
                }

                m = calculate(
                  f3,
                  calculate(f1, b[i1], calculate(f2, b[i2], b[i3])),
                  b[i4],
                );
                if (Math.abs(m - 24) < 1e-5) {
                  res +=
                    '(' +
                    b[i1] +
                    operator[f1] +
                    '(' +
                    b[i2] +
                    operator[f2] +
                    b[i3] +
                    '))' +
                    operator[f3] +
                    b[i4];

                  if (n !== 0 && ++k >= n) return res;
                }

                m = calculate(
                  f1,
                  b[i1],
                  calculate(f2, b[i2], calculate(f3, b[i3], b[i4])),
                );
                if (Math.abs(m - 24) < 1e-5) {
                  res +=
                    b[i1] +
                    operator[f1] +
                    '(' +
                    b[i2] +
                    operator[f2] +
                    '(' +
                    b[i3] +
                    operator[f3] +
                    b[i4] +
                    '))';

                  if (n !== 0 && ++k >= n) return res;
                }

                m = calculate(
                  f2,
                  calculate(f1, b[i1], b[i2]),
                  calculate(f3, b[i3], b[i4]),
                );
                if (Math.abs(m - 24) < 1e-5) {
                  res +=
                    '(' +
                    b[i1] +
                    operator[f1] +
                    b[i2] +
                    ')' +
                    operator[f2] +
                    '(' +
                    b[i3] +
                    operator[f3] +
                    b[i4] +
                    ')';

                  if (n !== 0 && ++k >= n) return res;
                }
              }
        }

  return null;
}
