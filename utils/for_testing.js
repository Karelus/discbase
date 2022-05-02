const discSpeedAverage = (discs) => {
  const reducer = (sum, item) => {
    return sum + item.speed
  }

  return discs.length === 0 ? 0 : discs.reduce(reducer, 0) / discs.length
}

module.exports = {
  discSpeedAverage,
}
