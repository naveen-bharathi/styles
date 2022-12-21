const prettier = require('prettier')
const {
  generateConstantsFromPostCss,
} = require('@naveen-bharathi/scripts/styles/generate-constants-from-postcss')

const prettierConfig = prettier.resolveConfig.sync('./.prettierrc.json')

generateConstantsFromPostCss({
  filePaths: [['./src/constants.css', './src/constants/index.ts']],
  prettierConfig,
})
