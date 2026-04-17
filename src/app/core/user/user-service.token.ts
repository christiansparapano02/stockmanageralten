import { InjectionToken } from '@angular/core';
import { IUserService } from './user-service.interface';

export const USER_SERVICE_TOKEN = new InjectionToken<IUserService>('USER_SERVICE_TOKEN');
