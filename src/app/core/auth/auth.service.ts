import { Injectable, signal } from '@angular/core';

import { Permission } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  activePermission = signal<Permission>('user');

  authenticate(email: string, password: string) {
    console.log(email, password);
    if (email === 'admin@example.com' && password === 'admin') {
      this.activePermission.set('admin');
    } else if (email === 'user@example.com' && password === 'user') {
      this.activePermission.set('user');
    }
  }

  logout() {
    this.activePermission.set('user');
  }
}
