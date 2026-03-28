import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'list', loadComponent: () => import('./pages/list/list').then(m => m.ListPage) },
  { path: 'detail/:id', loadComponent: () => import('./pages/detail/detail').then(m => m.Detail) },
  { path: '**', redirectTo: 'dashboard' },
];
