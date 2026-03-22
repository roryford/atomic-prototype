import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { ListPage } from './pages/list/list';
import { Detail } from './pages/detail/detail';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'list', component: ListPage },
  { path: 'detail/:id', component: Detail },
];
