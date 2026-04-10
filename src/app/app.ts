import { Component, signal } from '@angular/core';

import { Header } from './layout/header/header';

import { Categories } from './features/categories/categories';
import { Sidebar } from './layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, Categories, Sidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('stockmanageralten');
}
