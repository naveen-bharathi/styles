const fs = require('fs')
const prettier = require('prettier')

function getConstantsFileContent(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8')

  return (
    fileContent
      .replace(/\n\n/g, '\n')
      .replace(/\$/g, 'export const ')
      .replace(/: /g, ' = \'')
      .replace(/;/g, '\';')
  )
}

function generateConstantsFromPostCss(filePathsToConvert = [], prettierConfig) {
  filePathsToConvert.forEach(([postCssFilePath, jsOrTsFilePath]) => {
    const fileContent = getConstantsFileContent(postCssFilePath)

    fs.writeFileSync(
      jsOrTsFilePath,
      prettier.format(fileContent, {
        ...prettierConfig,
        filepath: jsOrTsFilePath,
      }),
    )
  })
}

module.exports = {
  generateConstantsFromPostCss
}
