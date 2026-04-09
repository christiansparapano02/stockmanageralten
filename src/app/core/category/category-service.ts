import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from './category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private mockCategories: Category[] = [
    { id: 1, name: 'Office', icon: 'pi pi-envelope', accessible: true },
    { id: 2, name: 'Medical', icon: 'pi pi-plus', accessible: false },
    { id: 3, name: 'Security', icon: 'pi pi-lock', accessible: true },
    { id: 4, name: 'Break', icon: 'pi pi-clock', accessible: false },
    { id: 5, name: 'Furniture', icon: 'pi pi-home', accessible: true },
    { id: 6, name: 'Hardware', icon: 'pi pi-desktop', accessible: true },
    { id: 7, name: 'Cleaning', icon: 'pi pi-trash', accessible: false },
    { id: 8, name: 'Tools', icon: 'pi pi-cog', accessible: true },
  ];

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories);
  }
}
