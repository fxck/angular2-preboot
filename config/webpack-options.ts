export const EXCLUDE_SOURCEMAPS = [
  // these packages have problems with their sourcemaps
  'node_modules/@angular',
  'node_modules/rxjs',
];

export const COPY_FOLDERS = [
  // uncomment to enable gestures
  // { from: `node_modules/hammerjs/hammer.min.js` },
  // { from: `node_modules/hammerjs/hammer.min.js.map` }
];

export const PLUGINS = {
  common: [ ],
  dev: [ ],
  prod: [ ]
};

export const RULES = {
  defaults: { },
  common: [ ],
  dev: [ ],
  prod: [ ]
};

export const DEV_SERVER_OPTIONS = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
};
