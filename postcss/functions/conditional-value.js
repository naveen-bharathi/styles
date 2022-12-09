function conditionalValue(...args) {
  const [condition, valueIfSatisfied, valueIfUnsatisfied] = args

  if (!condition || (condition === 'false')) {
    return valueIfUnsatisfied
  }

  return valueIfSatisfied
}

module.exports = conditionalValue
