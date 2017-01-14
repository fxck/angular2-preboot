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
// import { AotPlugin } from '@ngtools/webpack';
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
import * as HtmlElementsPlugin from './config/html-elements-plugin';

import * as CompressionPlugin from 'compression-webpack-plugin';
import * as ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
import * as WebpackMd5Hash from 'webpack-md5-hash';
import * as webpackMerge from 'webpack-merge';
import { NgcWebpackPlugin } from 'ngc-webpack';

import * as Autoprefixer from 'autoprefixer';
import * as CssNano from 'cssnano';

import {
  loader
} from './config/webpack';

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
  CUSTOM_COPY_FOLDERS,
  CUSTOM_DEV_SERVER_OPTIONS,
  CUSTOM_PLUGINS_COMMON,
  CUSTOM_PLUGINS_DEV,
  CUSTOM_PLUGINS_PROD,
  CUSTOM_RULES_COMMON
} from './config/custom';

// html
import headTags from './config/head';
import meta from './config/meta';

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
  { from: `node_modules/hammerjs/hammer.min.js` },
  { from: `node_modules/hammerjs/hammer.min.js.map` },

  ...CUSTOM_COPY_FOLDERS,

];

// is dll
if (!isDll && isDev) {
  tryDll(['polyfills', 'vendors', 'rxjs']);
}

// common
const commonConfig = () => {
  const config: WebpackConfig = <WebpackConfig>{};

  config.module = {
    rules: [
      loader.jsonLoader,
      loader.cssLoader,
      loader.htmlLoader,
      loader.fileLoader,

      ...CUSTOM_RULES_COMMON,

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
    new HtmlElementsPlugin({ headTags }),
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

    ...CUSTOM_PLUGINS_COMMON,
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
  const config: WebpackConfig = <WebpackConfig>{};

  config.devtool = 'eval-source-map';

  config.module = {
    rules: [
      loader.tsLintLoader,
      loader.tsLoader(isAoT)
    ]
  };

  config.resolve = {
    modules: [root(`src`), `node_modules`],
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

  COPY_FOLDERS.push({ from: `dll`, ignore: ['*.json'] });

  config.plugins = [
    new DllReferencePlugin({
      context: '.',
      manifest: require(`./dll/polyfills-manifest.json`),
    }),
    new DllReferencePlugin({
      context: '.',
      manifest: require(`./dll/vendors-manifest.json`),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      meta,
      inject: 'head'
    }),
    new CopyWebpackPlugin(COPY_FOLDERS),

    ...CUSTOM_PLUGINS_DEV,
  ];

  if (isWebpackDevServer) {
    config.devServer = Object.assign(
      {
        contentBase: root(`src`),
        historyApiFallback: true,
        host: HOST,
        port: PORT,
      },
      CUSTOM_DEV_SERVER_OPTIONS,
    );
  }

  return config;
};

// dll
const dllConfig = () => {

  const config: WebpackConfig = <WebpackConfig>{};

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

  const config: WebpackConfig = <WebpackConfig>{};

  config.devtool = 'source-map';

  config.module = {
    rules: [
      loader.tsLoader(isAoT)
    ]
  };

  config.entry = {
    main: `./src/main.browser.aot`,
    polyfills: polyfills(isDev),
    rxjs: rxjs(),
    vendors: vendors(),
  };

  config.output = {
    path: root(`dist`),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js',
  };

  config.plugins = [
    new V8LazyParseWebpackPlugin(),
    // new NoErrorsPlugin(), // quality
    // This enables tree shaking of the vendor modules
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills'],
    }),
    new CommonsChunkPlugin({
      name: 'rxjs',
      chunks: ['main'],
      minChunks: (module) => /node_modules\//.test(module.resource)
    }),
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['main'],
      minChunks: (module) => /node_modules\//.test(module.resource)
    }),
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendors', 'rxjs'].reverse(),
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
    new HtmlWebpackPlugin({
      template: `src/index.html`,
      meta,
      inject: 'head'
    }),
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

    ...CUSTOM_PLUGINS_PROD,
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
    extensions: ['.ts', '.js', '.json'],
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
