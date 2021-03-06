import { Routes } from '@angular/router';
import { AboutComponent } from './about';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule' },
  { path: '**',    component: NoContentComponent },
];

export { ROUTES };
