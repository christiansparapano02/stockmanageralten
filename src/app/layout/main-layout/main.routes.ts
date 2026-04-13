import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../../features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Inventory - Dashboard',
    // canActivate: [adminGuard]
  },
  {
    path: 'categories',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../features/categories/categories').then((m) => m.Categories),
        title: 'Inventory - Categories',
      },
      {
        path: 'stock/:category', // Questo corrisponde a "/categories/stock/:category"
        loadComponent: () => import('../../features/stock/stock').then((m) => m.Stock),
        // canActivate:  [categoryGuard],
        title: 'Stock Details',
      },
    ],
  },

  {
    path: 'alerts',
    loadComponent: () => import('../../features/alerts/alerts').then((m) => m.Alerts),
    title: 'Inventory - Alerts',
  },
  {
    path: 'usersettings',
    loadComponent: () =>
      import('../../features/user-settings/user-settings').then((m) => m.UserSettings),
    title: 'Inventory - User Settings',
    // canActivate: [adminGuard]
  },
];
