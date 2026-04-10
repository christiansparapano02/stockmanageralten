import { Component, signal, inject } from '@angular/core';

import { Header } from './layout/header/header';

import { Categories } from './features/categories/categories';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Header, Categories, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('stockmanageralten');
}
