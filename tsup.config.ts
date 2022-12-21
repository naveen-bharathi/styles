import { defineConfig } from 'tsup';
import glob from 'glob';

export const tsup = defineConfig({
  dts: true,
  ...(
    (process.env.GENERATE_STYLES_FROM_CONFIG === 'true')
      ? {
        entry: {
          'build/generate-styles-from-config':
            'scripts/generate-styles-from-config.ts',
        },
      }
      : {
        entry: glob.sync('src/**/*.ts'),
      }
  ),
  external: [
    'fs',
    'glob',
    'path',
    'postcss',
    'prettier',
    'prop-types',
    'typescript-to-proptypes',
  ],
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  outDir: '.',
  platform: 'node',
  sourcemap: false,
});
