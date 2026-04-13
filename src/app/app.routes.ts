import { Routes } from '@angular/router';
import { Categories } from './features/categories/categories';
import { Stock } from './features/stock/stock';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: '',
    canActivate: [],
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),

    loadChildren: () => import('./layout/main-layout/main.routes').then((m) => m.MAIN_ROUTES),
  },
  //{ path: '**', redirectTo: 'login' },

  //   { path: '', redirectTo: 'categories', pathMatch: 'full' },
  //   { path: 'categories', component: Categories, title: 'Inventario - Categorie' },
  //   { path: 'stock/:category', component: Stock, title: 'Inventario - Stock' },
];
