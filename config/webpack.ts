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
  tsLoader: (aot = false) => ({
    test: /\.ts$/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.es2015.json'
        }
      },
      'angular2-template-loader',
      {
        loader: 'ng-router-loader',
        options: {
          loader: 'async-system',
          genDir: 'aot',
          aot
        }
      }
    ],
    exclude: [/\.(spec|e2e)\.ts$/],
  }),
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
