import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item.interface';
import { IItemService } from './item-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemRealService implements IItemService {
  private http = inject(HttpClient);
  private apiUrl = '/api/items';

  getByCategory(categoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getCatalogueByCategory(categoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/catalogue/category/${categoryId}`);
  }

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getCritical(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/critical`);
  }

  add(item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  update(updatedItem: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${updatedItem.id}`, updatedItem);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  deleteCatalogueItem(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/catalogue/${id}`);
  }

  getStock(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/stock`);
  }
}
