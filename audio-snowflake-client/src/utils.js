// Takes a number n, sets its bounds within current range [a, b ] and scales it according to the desired range [c, d]
function scale(n, a, b, c, d) {
  return c * (1 - ((n - a) / (b - a))) + d * (((n - a) / (b - a)))
}

function setBounds(n, start, stop) {
  return (n < start) ? start : ((n > stop) ? stop : n)
}

module.exports = { scale, setBounds }