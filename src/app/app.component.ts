/*
 * Angular 2 decorators and services
 */
import { ViewEncapsulation } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'sg-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css',
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>
  `,
})
export class AppComponent implements OnInit {

  public name = 'Angular 2 Preboot';
  public appState;

  constructor(
    appState: AppState,
  ) {
    this.appState = appState;
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
