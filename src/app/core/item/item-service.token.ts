import { InjectionToken } from '@angular/core';
import { IItemService } from './item-service.interface';

export const ITEM_SERVICE_TOKEN = new InjectionToken<IItemService>('ITEM_SERVICE_TOKEN');
