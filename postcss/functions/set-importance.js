function setImportance(value, importanceValue) {
  const isImportant = (importanceValue === '!important')

  return `${value}${isImportant ? ' !important' : ''}`
}

module.exports = setImportance
