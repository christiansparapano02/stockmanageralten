import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const authService = inject(AuthService);
  const token = session.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
        return authService.refresh().pipe(
          switchMap((response) => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            return next(newReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
