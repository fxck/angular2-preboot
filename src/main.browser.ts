/*
 * Angular 2.x bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  bootstrapDomLoading,
  bootstrapDomReady
} from './bootstrap';

/*
 * App Module
 */
import { AppModule } from './app';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

// use bootloader in case of async tag
if (window['module'] === 'aot') {
  bootstrapDomReady(main);
} else {
  bootstrapDomLoading(main);
}
