import { Component, inject, OnInit, signal } from '@angular/core';

import { DarkModeService } from '../../core/dark_mode.service';
import { Router, RouterLink } from '@angular/router';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Menu, Avatar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  darkModeService = inject(DarkModeService);
  menuItems: MenuItem[] = [];
  location = signal<string>('');

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: `<div class="user-menu-header">
                <span class="user-name">Mario Rossi</span>
                <span class="user-role">Admin</span>
              </div>`,
        icon: 'pi pi-user',
        escape: false,
        disabled: true,
        styleClass: 'user-header-item',
      },
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    // logica logout
    this.router.navigate(['/login']);
  }
}
