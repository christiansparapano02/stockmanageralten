import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const categoryGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Estrae il nome della categoria dall'URL (es. "Medical")
  const categoryName = route.params['category'];

  //  Se non è loggato, al login
  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  //  Se ha i permessi (Admin o Ruolo corrispondente)
  if (authService.canAccessCategory(categoryName)) {
    return true;
  }

  //  Se l'accesso è negato, reindirizza alla rotta base corretta per l'utente
  //admin in dashboard, utente in lista categories
  return router.parseUrl(authService.getInitialRoute());
};
