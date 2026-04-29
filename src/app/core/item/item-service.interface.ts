import { Observable } from 'rxjs';
import { Item } from './item.interface';

export interface IItemService {
  getByCategory(categoryId: string): Observable<Item[]>;
  getCatalogueByCategory(categoryId: string): Observable<Item[]>;
  getAll(): Observable<Item[]>;
  getCritical(): Observable<Item[]>;
  add(item: Omit<Item, 'id'>): Observable<Item>;
  update(updatedItem: Item): Observable<Item>;
  delete(id: string): Observable<boolean>;
  deleteCatalogueItem(id: string): Observable<boolean>;
  getStock(): Observable<Item[]>;
}
