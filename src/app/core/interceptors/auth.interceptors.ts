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

//con REFRESH
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const session = inject(SessionService);
//   const authService = inject(AuthService);

//   const token = session.getToken();
//   let authReq = req;

//   // 1. GESTIONE IN USCITA: Se abbiamo un token, lo aggiungiamo alla richiesta
//   if (token) {
//     authReq = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` },
//     });
//   }

// 2. GESTIONE RISPOSTA:
//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       // Se l'errore è 401 e non è un tentativo di login o refresh già in corso
//       if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
//         return authService.refresh().pipe(
//           switchMap((response) => {
//             // Refresh riuscito! Riprova la chiamata originale con il nuovo token
//             const retryReq = req.clone({
//               setHeaders: { Authorization: `Bearer ${response.token}` },
//             });
//             return next(retryReq);
//           }),
//           catchError((refreshError) => {
//             // Se anche il refresh fallisce (es. refresh token scaduto), slogghiamo
//             authService.logout();
//             return throwError(() => refreshError);
//           }),
//         );
//       }

//       return throwError(() => error);
//     }),
//   );
// };
