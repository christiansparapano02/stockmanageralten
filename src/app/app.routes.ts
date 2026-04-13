import { Routes } from '@angular/router';
import { Categories } from './features/categories/categories';
import { Stock } from './features/stock/stock';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: Categories, title: 'Inventario - Categorie' },
  { path: 'stock/:category', component: Stock, title: 'Inventario - Stock' },
];
