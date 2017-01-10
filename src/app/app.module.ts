import {
  ApplicationRef,
  NgModule
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { AboutComponent } from './about';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { AppState } from './app.service';
import { HomeComponent } from './home';
import { XLargeDirective } from './home/x-large';
import { NoContentComponent } from './no-content';

// Application wide providers
const APP_PROVIDERS = [
  AppState,

  ...APP_RESOLVER_PROVIDERS,
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NoContentComponent,
    XLargeDirective,
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
  ],
  entryComponents: [
    HomeComponent,
    AboutComponent,
  ],
})
export class AppModule {
  constructor(
    public appRef: ApplicationRef,
    public appState: AppState,
  ) { }

}
