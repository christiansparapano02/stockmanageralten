// import { inject } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
// import { CanActivateFn, Router } from '@angular/router';

// export const adminGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAdmin()) {
//     return true;
//   }

//   // Se non sei admin, non puoi stare in dashboard o usersettings
//   // rimanda alla sezione categorie
//   return router.parseUrl('/categories');
// };
