import summary from 'rollup-plugin-summary';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'main.js'
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({preventAssignment: false, 'Reflect.decorate': 'undefined'}),
    resolve(),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary(),
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
        { src: 'assets', dest: 'dist' },
        { src: 'components', dest: 'dist' },
        { src: 'contants', dest: 'dist' },
        { src: 'locales', dest: 'dist' },
        { src: 'router.js', dest: 'dist' },
        { src: 'store', dest: 'dist' },
        { src: 'styles', dest: 'dist' },
        { src: 'utils', dest: 'dist' },
        { src: 'views', dest: 'dist' }
      ]
    })
  ],
};