// helpers
import { root } from './helpers.ts';

// webpack
import { LoaderOptionsPlugin } from 'webpack';

// vendor
import * as Autoprefixer from 'autoprefixer';
import * as CssNano from 'cssnano';

// custom environment configs
export const CUSTOM_COMMON = {
  PLUGINS: [

  ],
  RULES: [
    // it is highly recommended to autoprefix and minify your CSS
    new LoaderOptionsPlugin({
      options: {
        postcss: () => {
          return [
            Autoprefixer,
            CssNano,
          ];
        },
      },
    }),
  ]
};

export const CUSTOM_DEV = {
  PLUGINS: [

  ],
  RULES: [

  ]
};

export const CUSTOM_PROD = {
  PLUGINS: [

  ],
  RULES: [

  ]
};

// custom generic
export const CUSTOM_COPY_FOLDERS = [

];

export const EXCLUDE_SOURCEMAPS = [
  // these packages have problems with their sourcemaps
  root('node_modules/@angular'),
  root('node_modules/rxjs'),
];

export const DEV_SERVER_OPTIONS = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
};
