function getNotchSafeAreaValue(edge, value) {
  return `max(${value}, env(safe-area-inset-${edge}))`
}

module.exports = getNotchSafeAreaValue
