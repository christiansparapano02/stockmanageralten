import { InjectionToken } from '@angular/core';
import { IOfficeService } from './office-service.interface';

export const OFFICE_SERVICE_TOKEN = new InjectionToken<IOfficeService>('OFFICE_SERVICE_TOKEN');
