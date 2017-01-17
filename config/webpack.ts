import { root } from './helpers.ts';

export const EXCLUDE_SOURCEMAPS = [
  // these packages have problems with their sourcemaps
  root('node_modules/@angular'),
  root('node_modules/rxjs'),
];

export const COPY_FOLDERS = [

];

export const PLUGINS = {
  common: [ ],
  dev: [ ],
  prod: [ ]
};

export const RULES = {
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
