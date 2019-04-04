export function hasSolutionOf24Point(nums) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== j) {
        for (let k = 0; k < 4; k++) {
          const foo = nums.filter((x, index) => index !== i && index !== j);
          foo.push(calculate(k, nums[i], nums[j]));

          for (let n = 0; n < 3; n++) {
            for (let m = 0; m < 3; m++) {
              if (n !== m) {
                for (let k = 0; k < 4; k++) {
                  const bar = foo.filter(
                    (x, index) => index !== n && index !== m,
                  );
                  bar.push(calculate(k, foo[m], foo[n]));

                  for (let p = 0; p < 2; p++) {
                    for (let q = 0; q < 2; q++) {
                      if (p !== q) {
                        for (let k = 0; k < 4; k++) {
                          const res = calculate(k, bar[p], bar[q]);

                          if (res === 24) return true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return false;
}

const calculate = (k, x, y) => {
  if (k === 0) {
    return x + y;
  }
  if (k === 1) {
    return x - y;
  }
  if (k === 2) {
    return x * y;
  }
  return x / y;
};
