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

// node
import * as process from 'process';
import 'ts-helpers';

// webpack
import {
  ContextReplacementPlugin,
  DefinePlugin,
  DllPlugin,
  DllReferencePlugin,
  LoaderOptionsPlugin,
  ProgressPlugin
} from 'webpack';

// optimization
import * as NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin';
import * as CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import * as OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import * as UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';

// loader
import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { CheckerPlugin } from 'awesome-typescript-loader';

// plugins
import * as CompressionPlugin from 'compression-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import { HtmlHeadElementsPlugin } from 'html-head-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { NgcWebpackPlugin } from 'ngc-webpack';
import * as ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import * as V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
import * as WebpackMd5Hash from 'webpack-md5-hash';
import * as webpackMerge from 'webpack-merge';

// defaults
import { loader } from './config/defaults';

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
  vendor,
} from './src/dll';

// custom
import {
  CUSTOM_COMMON,
  CUSTOM_COPY_FOLDERS,
  CUSTOM_DEV,
  CUSTOM_PROD,
  DEV_SERVER_OPTIONS
} from './config/custom';

// html
import { headTags } from './config/head';
import { CUSTOM_COMMON, CUSTOM_PROD } from './config/custom';

// config
const EVENT = process.env.npm_lifecycle_event;
const ENV = process.env.NODE_ENV || 'development';

const isDev = EVENT.includes('dev');
const isDll = EVENT.includes('dll');
const isAoT = !isDev;

const PORT = process.env.PORT ||
  ENV === 'development' ? 3000 : 8080;
const HOST = process.env.HOST || 'localhost';

const COPY_FOLDERS = [
  { from: `src/assets`, ignore: [`favicon.ico`] },
  { from: `src/assets/icon/favicon.ico` },
  { from: `src/meta` },

  ...CUSTOM_COPY_FOLDERS,

];

// is dll
if (!isDll && isDev) {
  tryDll(['polyfills', 'vendor', 'rxjs']);
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

      ...CUSTOM_COMMON.RULES,

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
    new HtmlHeadElementsPlugin({
      headTags
    }),

    ...CUSTOM_COMMON.PLUGINS,

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
      loader.tsLintLoader,
      loader.tsLoader(isAoT),

      ...CUSTOM_DEV.RULES

    ]
  };

  config.resolve = {
    modules: [root(`src`), `node_modules`],
  };

  config.entry = {
    main: [].concat(polyfills(isDev), './src/browser', rxjs()),
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
      manifest: require(`./dll/vendor-manifest.json`),
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'src/index.html',
      title: headTags.title
    }),
    new CopyWebpackPlugin(COPY_FOLDERS),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),

    ...CUSTOM_DEV.PLUGINS,

  ];

  if (isWebpackDevServer) {
    config.devServer = {
      contentBase: root(`src`),
      historyApiFallback: true,
      host: HOST,
      port: PORT,

      ...DEV_SERVER_OPTIONS
    };
  }

  return config;
};

// dll
const dllConfig = () => {

  const config: WebpackConfig = <WebpackConfig> {};

  config.entry = {
    polyfills: polyfills(isDev),
    rxjs: rxjs(),
    vendor: vendor(),
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
      loader.tsLoader(isAoT),

      ...CUSTOM_PROD.RULES

    ]
  };

  config.performance = {
    hints: 'warning'
  };

  config.entry = {
    main: `./src/browser.aot`,
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
      name: 'vendor',
      chunks: ['main'],
      minChunks: (module) => /node_modules\//.test(module.resource)
    }),
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor', 'rxjs'].reverse(),
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
      inject: 'head',
      template: `src/index.html`,
      title: headTags.title
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

    ...CUSTOM_PROD.PLUGINS,
  ];

  if (isAoT) {
    config.plugins.unshift(
      new NgcWebpackPlugin({
        disabled: !isAoT,
        tsConfig: root('tsconfig.es2015.json'),
        resourceOverride: ''
      }));
  }

  return config;
};

// default
const defaultConfig = () => {
  const config: WebpackConfig = <WebpackConfig> {};

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
