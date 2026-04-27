import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../shared/services/session.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (session.isLoggedIn() && session.isAdmin()) {
    return true;
  }

  //se non admin, rimanda a initial route
  return router.parseUrl(session.getInitialRoute());
};
