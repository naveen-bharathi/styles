const prettier = require('prettier')
const {
  setOutputLocations,
} = require('@naveen-bharathi/scripts/package/set-output-locations')

setOutputLocations({
  sourceDirectory: './src',
  cleanupShellFilePath: './.scripts/cleanup.sh',
  gitIgnorePath: './.gitignore',
  packageJsonPath: './package.json',
  prettierConfig: prettier.resolveConfig.sync('./.prettierrc.json'),
})
