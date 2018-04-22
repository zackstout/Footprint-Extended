
function cleanNumber(n) {
  const str = n.toString();
  const dot = str.includes('.');
  let res = '';
  for (let i=0; i < str.length; i++) {
    const index = str.length - 1 - i;
    res = str[index] + res;
    // wow why can't i think of a better way to do this....
    if (dot) {
      if (i > 2) {
        if (i % 3 == 2 && i !== str.length - 1) {
          res = ',' + res;
        }
      }
    } else {
      if (i % 3 == 2 && i !== str.length - 1) {
        res = ',' + res;
      }
    }
  }
  return res;
}

module.exports = cleanNumber;
