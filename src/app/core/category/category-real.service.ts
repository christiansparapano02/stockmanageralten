import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './category.interface';
import { ICategoryService } from './category-service.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryRealService implements ICategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
}
