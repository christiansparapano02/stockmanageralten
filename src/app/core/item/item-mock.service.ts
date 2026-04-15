import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Item } from './item.interface';
import { IItemService } from './item-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemMockService implements IItemService {
  private items: Item[] = [
    {
      id: '1',
      name: 'Carta A4 (risma)',
      categoryId: '1',
      quantity: 15,
      minQuantity: 10,
    },
    {
      id: '2',
      name: 'Penne biro',
      categoryId: '1',
      quantity: 30,
      minQuantity: 10,
    },
    {
      id: '3',
      name: 'Spillatrice',
      categoryId: '1',
      quantity: 1,
      minQuantity: 5,
    },
    {
      id: '4',
      name: 'Kit pronto soccorso',
      categoryId: '2',
      quantity: 3,
      minQuantity: 2,
    },
    {
      id: '5',
      name: 'Estintore',
      categoryId: '3',
      quantity: 4,
      minQuantity: 2,
    },
    {
      id: '6',
      name: 'Badge accesso',
      categoryId: '3',
      quantity: 0,
      minQuantity: 5,
    },
    {
      id: '7',
      name: 'Macchinetta caffè',
      categoryId: '4',
      quantity: 2,
      minQuantity: 1,
    },
  ];

  getByCategory(categoryId: string): Observable<Item[]> {
    return of(this.items.filter((i) => i.categoryId === categoryId)).pipe(delay(800));
  }

  getCritical(): Observable<Item[]> {
    return of(this.items.filter((item) => item.quantity === 0)).pipe(delay(800));
  }

  add(item: Omit<Item, 'id'>): Observable<Item> {
    const newItem: Item = {
      ...item,
      id: crypto.randomUUID(),
    };

    this.items.push(newItem);
    return of(newItem).pipe(delay(800));
  }

  update(updatedItem: Item): Observable<Item> {
    const index = this.items.findIndex((i) => i.id === updatedItem.id);

    if (index !== -1) {
      this.items[index] = { ...updatedItem };
    }

    return of(updatedItem).pipe(delay(800));
  }

  delete(id: string): Observable<boolean> {
    this.items = this.items.filter((i) => i.id !== id);
    return of(true).pipe(delay(800));
  }
}
