/* tslint:disable: variable-name max-line-length no-var-requires no-unused-variable */

/**
 *
 * - imports
 * - custom
 * - config
 * - common
 * - dev
 * - dll
 * - prod
 * - webpack
 */

// imports
import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { CheckerPlugin } from 'awesome-typescript-loader';
import * as process from 'process';
import 'ts-helpers';
import {
  ContextReplacementPlugin,
  DefinePlugin,
  DllPlugin,
  DllReferencePlugin,
  LoaderOptionsPlugin,
  ProgressPlugin
} from 'webpack';

import * as NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin';
import * as CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import * as OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import * as UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';

import * as CompressionPlugin from 'compression-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import { HtmlHeadElementsPlugin } from 'html-head-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { NgcWebpackPlugin } from 'ngc-webpack';
import * as ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import * as V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
import * as WebpackMd5Hash from 'webpack-md5-hash';
import * as webpackMerge from 'webpack-merge';

import * as Autoprefixer from 'autoprefixer';
import * as CssNano from 'cssnano';

// helpers
import {
  isWebpackDevServer,
  root,
  tryDll,
} from './config/helpers';

// dll's
import {
  polyfills,
  rxjs,
  vendors,
} from './src/dll';

// custom
import {
  COPY_FOLDERS as USER_COPY_FOLDERS,
  DEV_SERVER_OPTIONS as USER_DEV_SERVER_OPTIONS,
  PLUGINS as USER_PLUGINS,
  RULES as USER_RULES,
  EXCLUDE_SOURCEMAPS as USER_EXCLUDE_SOURCEMAPS
} from './config/webpack';

// html
import headTags from './config/head';

// config
const EVENT = process.env.npm_lifecycle_event;
const ENV = process.env.NODE_ENV || 'development';

const isDev = EVENT.includes('dev');
const isDll = EVENT.includes('dll');
const isAoT = !isDev;
// const isJiT = !isAoT;

const PORT = process.env.PORT ||
  ENV === 'development' ? 3000 : 8080;
const HOST = process.env.HOST || 'localhost';

const COPY_FOLDERS = [
  { from: `src/assets`, ignore: [`favicon.ico`] },
  { from: `src/assets/icon/favicon.ico` },
  { from: `src/meta` },

  ...USER_COPY_FOLDERS,

];

// is dll
if (!isDll && isDev) {
  tryDll([ 'polyfills', 'vendors', 'rxjs' ]);
}

let loaderRules = {
  tsLintLoader: {
    enforce: 'pre',
    test: /\.ts$/,
    use: [ 'tslint-loader' ]
  },
  sourceMapLoader: {
    test: /\.js$/,
    use: 'source-map-loader',
    exclude: [ USER_EXCLUDE_SOURCEMAPS ]
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
          aot: aot
        }
      }
    ],
    exclude: [ /\.(spec|e2e)\.ts$/ ],
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
  },
  htmlLoader: {
    test: /\.html$/,
    use: 'raw-loader',
    exclude: [ root('src/index.html') ],
  },
  fileLoader: {
    test: /\.(jpg|png|gif)$/,
    use: 'file-loader',
  }
};

// common
const commonConfig = () => {
  const config: WebpackConfig = <WebpackConfig> {};

  config.module = {
    rules: [
      loaderRules.jsonLoader,
      loaderRules.cssLoader,
      loaderRules.htmlLoader,
      loaderRules.fileLoader,

      ...USER_RULES.common,
    ],
  };

  config.plugins = [
    new ProgressPlugin(),
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new DefinePlugin({
      __DEV__: isDev,
      __PROD__: !isDev
    }),
    new NamedModulesPlugin(),
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      root(`src`)
    ),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      meta: {
        title: headTags.title
      },
      inject: 'head'
    }),
    new HtmlHeadElementsPlugin({
      link: headTags.link,
      meta: headTags.meta
    }),
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        postcss: () => {
          return [
            Autoprefixer,
            CssNano,
          ];
        },
      },
    }),

    ...USER_PLUGINS.common,
  ];

  config.node = {
    Buffer: false,
    clearImmediate: false,
    clearTimeout: true,
    crypto: true,
    global: true,
    module: false,
    process: true,
    setImmediate: false,
    setTimeout: true,
  };

  return config;
};

// dev
const devConfig = () => {
  const config: WebpackConfig = <WebpackConfig> {};

  config.devtool = 'eval-source-map';

  config.module = {
    rules: [
      loaderRules.tsLintLoader,
      loaderRules.tsLoader(isAoT)
    ]
  };

  config.resolve = {
    modules: [ root(`src`), `node_modules` ],
  };

  config.entry = {
    main: [].concat(polyfills(isDev), './src/main.browser', rxjs()),
  };

  config.output = {
    path: root(`dist`),
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].chunk.js',
  };

  COPY_FOLDERS.push({ from: `dll`, ignore: [ '*.json' ] });

  config.plugins = [
    new DllReferencePlugin({
      context: '.',
      manifest: require(`./dll/polyfills-manifest.json`),
    }),
    new DllReferencePlugin({
      context: '.',
      manifest: require(`./dll/vendors-manifest.json`),
    }),
    new CopyWebpackPlugin(COPY_FOLDERS),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),

    ...USER_PLUGINS.dev,
  ];

  if (isWebpackDevServer) {
    config.devServer = Object.assign(
      {
        contentBase: root(`src`),
        historyApiFallback: true,
        host: HOST,
        port: PORT,
      },
      USER_DEV_SERVER_OPTIONS,
    );
  }

  return config;
};

// dll
const dllConfig = () => {

  const config: WebpackConfig = <WebpackConfig> {};

  config.entry = {
    polyfills: polyfills(isDev),
    rxjs: rxjs(),
    vendors: vendors(),
  };

  config.output = {
    path: root(`dll`),
    filename: '[name].dll.js',
    sourceMapFilename: '[name].dll.map',
    library: '__[name]',
  };

  config.plugins = [
    new DllPlugin({
      name: '__[name]',
      path: root('dll/[name]-manifest.json'),
    }),
  ];

  return config;

};

// prod
const prodConfig = () => {

  const config: WebpackConfig = <WebpackConfig> {};

  config.devtool = 'source-map';

  config.module = {
    rules: [
      loaderRules.tsLoader(isAoT)
    ]
  };

  config.performance = {
    hints: 'warning'
  };

  config.entry = {
    main: `./src/main.browser.aot`,
    polyfills: polyfills(isDev),
    rxjs: rxjs(),
  };

  config.output = {
    path: root(`dist`),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js',
  };

  config.plugins = [
    new V8LazyParseWebpackPlugin(),
    // new NoEmitOnErrorsPlugin(), // quality
    // This enables tree shaking of the vendor modules
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: [ 'main' ],
      minChunks: (module) => /node_modules\//.test(module.resource)
    }),
    new CommonsChunkPlugin({
      name: [ 'polyfills', 'vendors', 'rxjs' ].reverse(),
    }),
    new OccurrenceOrderPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 2 * 1024,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin(COPY_FOLDERS),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false, // we need this for lazy v8
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false
      },
      comments: false,
    }),
    new WebpackMd5Hash(),

    ...USER_PLUGINS.prod,
  ];

  if (isAoT) {
    config.plugins.unshift(new NgcWebpackPlugin({
      disabled: !isAoT,
      tsConfig: root('tsconfig.es2015.json'),
      resourceOverride: ''
    }));
  }

  return config;

};

// default
const defaultConfig = () => {
  const config: WebpackConfig = {} as WebpackConfig;

  config.resolve = {
    extensions: [ '.ts', '.js', '.json' ],
  };

  return config;
};

// webpack
switch (ENV) {
  case 'prod':
  case 'production':
    module.exports = webpackMerge({}, defaultConfig(), prodConfig(), commonConfig());
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = isDll
      ? webpackMerge({}, defaultConfig(), commonConfig(), dllConfig())
      : webpackMerge({}, defaultConfig(), commonConfig(), devConfig());
}
