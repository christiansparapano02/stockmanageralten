import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const token = session.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};

//alternativa per gestire 401
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const session = inject(SessionService);
//   const authService = inject(AuthService); // Serve per il logout
//   const token = session.getToken();

//   let request = req;

//   if (token) {
//     request = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   return next(request).pipe(
//     catchError((error) => {
//       // Se il server risponde 401, il token è scaduto o non valido
//       if (error instanceof HttpErrorResponse && error.status === 401) {
//         authService.logout(); // Pulisce la sessione e manda al login
//       }
//       return throwError(() => error);
//     }),
//   );
// };
