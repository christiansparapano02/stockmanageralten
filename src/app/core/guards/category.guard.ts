import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../shared/services/session.service';

export const categoryGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  // Estrae id della categoria dall'URL
  const categoryId = route.paramMap.get('id');

  //  Se non è loggato, al login
  if (!session.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  //  Se ha i permessi (Admin o Ruolo corrispondente)
  if (categoryId && session.canAccessCategory(categoryId)) {
    return true;
  }

  //  Se l'accesso è negato, reindirizza alla rotta base corretta per l'utente
  //admin in dashboard, utente in lista categories
  return router.parseUrl(session.getInitialRoute());
};
