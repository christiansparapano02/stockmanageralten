import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { CATEGORY_SERVICE_TOKEN } from './core/category/category-service.token';
import { CategoryMockService } from './core/category/category-mock.service';
import { ITEM_SERVICE_TOKEN } from './core/item/item-service.token';
import { ItemMockService } from './core/item/item-mock.service';
import { provideHttpClient } from '@angular/common/http';

import { USER_SERVICE_TOKEN } from './core/user/user-service.token';
import { MockUserService } from './core/user/mock.user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    {
      provide: CATEGORY_SERVICE_TOKEN,
      useExisting: CategoryMockService,
    },
    {
      provide: ITEM_SERVICE_TOKEN,
      useClass: ItemMockService,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: MockUserService, //modificare con RealUserService dopo
    },
  ],
};
