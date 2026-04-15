import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category } from './category.interface';
import { ICategoryService } from './category-service.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryMockService implements ICategoryService {
  private mockCategories: Category[] = [
    { id: 1, name: 'Office', icon: 'pi pi-envelope', accessible: true },
    { id: 2, name: 'Medical', icon: 'pi pi-plus', accessible: true },
    { id: 3, name: 'Security', icon: 'pi pi-lock', accessible: true },
    { id: 4, name: 'Break', icon: 'pi pi-clock', accessible: true },
  ];

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(800));
  }
}
