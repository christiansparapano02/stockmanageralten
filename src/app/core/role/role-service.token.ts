import { InjectionToken } from '@angular/core';
import { IRoleService } from './role-service.interface';

export const ROLE_SERVICE_TOKEN = new InjectionToken<IRoleService>('ROLE_SERVICE_TOKEN');
