const addInPx = require('../functions/add-in-px')
const conditionalValue = require('../functions/conditional-value')
const getNotchSafeAreaValue = require('../functions/get-notch-safe-area-value')
const isEqual = require('../functions/is-equal')
const setImportance = require('../functions/set-importance')
const unit = require('../functions/unit')

function getPostCSSConfig(plugins = {}) {
  return {
    plugins: {
      'postcss-import': {},
      'postcss-each': {},
      'postcss-mixins': {},
      'postcss-simple-vars': {},
      'postcss-nested': {},
      'postcss-functions': {
        functions: {
          addInPx,
          conditionalValue,
          getNotchSafeAreaValue,
          isEqual,
          setImportance,
          unit,
        },
      },
      autoprefixer: {},
      ...plugins,
    },
  }
}

module.exports = {
  getPostCSSConfig,
}
