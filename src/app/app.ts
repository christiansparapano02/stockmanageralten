import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';
import { LoginComponent } from './features/categories/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
