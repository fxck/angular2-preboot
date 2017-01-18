import * as fs from 'fs';
import * as path from 'path';
import tsConfig = require('../tsconfig.json');

export const root = path.join.bind(path, path.resolve(__dirname, '..'));

export const compilerOptions = Object.assign(tsConfig.compilerOptions, { module: 'es2015' });
export const hasProcessFlag = (flag) => process.argv.join('').indexOf(flag) > -1;
export const isWebpackDevServer = () => process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));

export const toSpawn = (cb, task) => {
  try {
    cb();
  } catch (e) {
    const spawn: any = require('cross-spawn');
    spawn.sync('npm', ['run', task], { stdio: 'inherit' });
    return true;
  }
};

export const tryDll = (manifests) => {
  toSpawn(() => manifests
    .forEach((manifest) => {
      fs.accessSync(`dll/${manifest}-manifest.json`);
    }), 'dll');
};

export const getMergedDefaultRules = (defaults, custom): any => {
  const keys = Object.keys(defaults);
  const rulesOptions = ['enforce', 'use', 'test', 'exclude'];

  const mergedConf = {};

  keys.forEach(key => {
    // if key is not defined in custom rules,
    // add the default one
    if (!custom[key]) {
      mergedConf[key] = defaults[key];
    } else {
      const combinedSingleRule = {};

      rulesOptions.forEach(rule => {
        // if the rule is defined, use it
        if (custom[key][rule]) {
          combinedSingleRule[rule] = custom[key][rule];
        // if not, and it's not explicity `false`
        // and it's defined in default rules, use
        // the default rule
        } else if (custom[key][rule] !== false && defaults[key][rule]) {
          combinedSingleRule[rule] = defaults[key][rule];
        }
      });

      mergedConf[key] = combinedSingleRule;
    }
  });

  return mergedConf;
};
