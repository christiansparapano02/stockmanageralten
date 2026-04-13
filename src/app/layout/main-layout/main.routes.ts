import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
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
        canActivate: [
          /*categoryGuard*/
        ],
        title: 'Stock Details',
      },

      //implementare altre rotte con componenti dashboard, user setting, alerts
    ],
  },

  {
    path: 'alerts',
    loadComponent: () => import('../../features/alerts/alerts').then((m) => m.Alerts),
    title: 'Inventory - Alerts',
  },
];
