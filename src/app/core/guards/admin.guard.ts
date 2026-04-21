// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   GuardResult,
//   MaybeAsync,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { AuthService } from '../auth/auth.service';
// import { Observable } from 'rxjs';

import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CanActivateFn, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AdminGuard implements CanActivate {
//   constructor(private authService: AuthService) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ): boolean | Promise<boolean> | Observable<boolean> | UrlTree {
//     return this.authService.;
//   }
// }

// FARLO CON FUNZIONE
// PROTEGGE SE NON ADMIN

// core/auth/guards/admin.guard.ts
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Se non sei admin, non puoi stare in dashboard o usersettings
  // rimanda alla sezione categorie
  return router.parseUrl('/categories');
};
