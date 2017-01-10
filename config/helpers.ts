/* tslint:disable: variable-name max-line-length no-var-requires no-unused-variable */
import * as fs from 'fs';
import * as path from 'path';
import tsConfig = require('../tsconfig.json');

export const root = path.join.bind(path, path.resolve(__dirname, '..'));

export const compilerOptions = ({ ...tsConfig.compilerOptions, module: 'es2015' });
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
