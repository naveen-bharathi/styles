function unit(value, unit) {
  if (unit) {
    return `${value}${unit}`
  }

  return `${parseFloat(String(value)) / 4}rem`
}

module.exports = unit
