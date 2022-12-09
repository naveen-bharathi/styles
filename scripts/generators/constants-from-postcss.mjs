import prettier from 'prettier'
import generateConstantsFromPostCss
  from '../utils/generate-constants-from-postcss.js'

const prettierConfig = prettier.resolveConfig.sync('./.prettierrc.json')

generateConstantsFromPostCss(
  [
    ['./constants.css', './constants/index.js'],
  ],
  prettierConfig,
)
