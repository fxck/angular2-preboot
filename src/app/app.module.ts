import {
  ApplicationRef,
  NgModule
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
// App is our top level component
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

import { Md2Module } from 'md2';

// Application wide providers
const APP_PROVIDERS = [
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      enableTracing: !__PROD__
    }),
    ReactiveFormsModule,
    Md2Module.forRoot()
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
  ]
})
export class AppModule {
  constructor(
    public appRef: ApplicationRef,
  ) { }

}
