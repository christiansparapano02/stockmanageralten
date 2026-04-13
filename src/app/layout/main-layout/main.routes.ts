import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../features/categories/categories').then((m) => m.Categories),
        title: 'Inventario - Categorie',
      },
      {
        path: 'stock/:category', // Questo corrisponde a "/categories/stock/:category"
        loadComponent: () => import('../../features/stock/stock').then((m) => m.Stock),
        canActivate: [
          /*categoryGuard*/
        ],
        title: 'Dettaglio Stock',
      },

      //implementare altre rotte con componenti dashboard, user setting, alerts
    ],
  },
];
