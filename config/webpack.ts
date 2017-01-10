import { EXCLUDE_SOURCEMAPS } from './custom';
import { root } from './helpers';


export const loader = {
  tsLintLoader: {
    enforce: 'pre',
    test: /\.ts$/,
    use: ['tslint-loader']
  },
  sourceMapLoader: {
    test: /\.js$/,
    use: 'source-map-loader',
    exclude: [EXCLUDE_SOURCEMAPS]
  },
  jitLoader: {
    test: /\.ts$/,
    use: [
      'awesome-typescript-loader',
      'angular2-template-loader',
      'angular-router-loader',
    ],
    exclude: [/\.(spec|e2e)\.ts$/],
  },
  aotLoader: {
    test: /\.ts$/,
    use: [
      '@ngtools/webpack',
      'angular2-template-loader',
      'angular-router-loader',
    ],
    exclude: [/\.(spec|e2e)\.ts$/],
  },
  jsonLoader: {
    test: /\.json$/,
    use: 'json-loader',
  },
  cssLoader: {
    test: /\.css$/,
    use: [
      'to-string-loader',
      'css-loader',
      'postcss-loader'
    ],
  }, htmlLoader: {
    test: /\.html$/,
    use: 'raw-loader',
    exclude: [root('src/index.html')],
  },
  fileLoader: {
    test: /\.(jpg|png|gif)$/,
    use: 'file-loader',
  }
};
