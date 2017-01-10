/*
 * Angular bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  bootstrapDomLoading,
  bootstrapDomReady
} from './bootstrap';
import { decorateModuleRef } from './env';

/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main() {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

// use bootloader in case of async tag
if (__PROD__) {
  bootstrapDomReady(main);
} else {
  bootstrapDomLoading(main);
};
