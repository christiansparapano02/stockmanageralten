import { Component, signal } from '@angular/core';

import { Header } from './layout/header/header';
import { Categories } from './features/categories/categories';

@Component({
  selector: 'app-root',
  imports: [Header, Categories],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('stockmanageralten');
}
