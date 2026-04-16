import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: '',
    //canActivate: [AuthGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),

    loadChildren: () => import('./layout/main-layout/main.routes').then((m) => m.MAIN_ROUTES),
  },

  {
    path: 'forgotpassword',
    loadComponent: () =>
      import('./features/forgotpassword/forgotpassword').then((m) => m.ForgotPassword),
    title: 'Forgot Password',
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support').then((m) => m.Support),
  },
  //{ path: '**', redirectTo: 'login' },
];
