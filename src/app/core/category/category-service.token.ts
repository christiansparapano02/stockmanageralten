import { InjectionToken } from '@angular/core';
import { ICategoryService } from './category-service.interface';

export const CATEGORY_SERVICE_TOKEN = new InjectionToken<ICategoryService>(
  'CATEGORY_SERVICE_TOKEN',
);
