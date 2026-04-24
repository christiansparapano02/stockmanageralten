import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Item } from './item.interface';
import { IItemService } from './item-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemMockService implements IItemService {
  private items: Item[] = [
    // CATALOGUE (non in stock)
    {
      id: '1',
      name: 'Carta A4 (risma)',
      categoryId: '1',
      quantity: 0,
      minQuantity: 10,
      inStock: false,
    },
    { id: '2', name: 'Penne biro', categoryId: '1', quantity: 0, minQuantity: 10, inStock: false },
    { id: '3', name: 'Spillatrice', categoryId: '1', quantity: 0, minQuantity: 5, inStock: false },
    {
      id: '4',
      name: 'Kit pronto soccorso',
      categoryId: '2',
      quantity: 0,
      minQuantity: 2,
      inStock: false,
    },
    { id: '5', name: 'Estintore', categoryId: '3', quantity: 0, minQuantity: 2, inStock: false },
    {
      id: '6',
      name: 'Badge accesso',
      categoryId: '3',
      quantity: 0,
      minQuantity: 5,
      inStock: false,
    },
    {
      id: '7',
      name: 'Macchinetta caffè',
      categoryId: '4',
      quantity: 0,
      minQuantity: 1,
      inStock: false,
    },

    // STOCK (già presenti)
    {
      id: 's1',
      name: 'Carta A4 (risma)',
      categoryId: '1',
      quantity: 15,
      minQuantity: 10,
      inStock: true,
    },
    { id: 's2', name: 'Penne biro', categoryId: '1', quantity: 30, minQuantity: 10, inStock: true },
    { id: 's3', name: 'Spillatrice', categoryId: '1', quantity: 1, minQuantity: 5, inStock: true },
    {
      id: 's4',
      name: 'Kit pronto soccorso',
      categoryId: '2',
      quantity: 3,
      minQuantity: 2,
      inStock: true,
    },
    { id: 's5', name: 'Estintore', categoryId: '3', quantity: 4, minQuantity: 2, inStock: true },
    {
      id: 's6',
      name: 'Badge accesso',
      categoryId: '3',
      quantity: 0,
      minQuantity: 5,
      inStock: true,
    },
    {
      id: 's7',
      name: 'Macchinetta caffè',
      categoryId: '4',
      quantity: 2,
      minQuantity: 1,
      inStock: true,
    },
  ];

  getAll(): Observable<Item[]> {
    return of(this.items.filter((i) => !i.inStock)).pipe(delay(800));
  }

  getByCategory(categoryId: string): Observable<Item[]> {
    return of(this.items.filter((i) => i.categoryId === categoryId && i.inStock)).pipe(delay(800));
  }

  getCatalogueByCategory(categoryId: string): Observable<Item[]> {
    const inStockNames = this.items
      .filter((i) => i.categoryId === categoryId && i.inStock)
      .map((i) => i.name);

    return of(
      this.items.filter(
        (i) => i.categoryId === categoryId && !i.inStock && !inStockNames.includes(i.name),
      ),
    ).pipe(delay(800));
  }

  getCritical(): Observable<Item[]> {
    return of(this.items.filter((i) => i.inStock && i.quantity === 0)).pipe(delay(800));
  }

  add(item: Omit<Item, 'id'>): Observable<Item> {
    const newItem: Item = {
      ...item,
      id: crypto.randomUUID(),
    };

    this.items.push(newItem);

    return of(newItem).pipe(delay(800));
  }

  // ✏️ UPDATE
  update(updatedItem: Item): Observable<Item> {
    const index = this.items.findIndex((i) => i.id === updatedItem.id);

    if (index !== -1) {
      this.items[index] = { ...updatedItem };
    }

    return of(updatedItem).pipe(delay(800));
  }
  delete(id: string): Observable<boolean> {
    const item = this.items.find((i) => i.id === id);
    if (!item) return of(false);

    if (!item.inStock) {
      // 🟦 Eliminazione dal CATALOGUE
      // rimuovo il template
      this.items = this.items.filter((i) => i.id !== id);

      // rimuovo anche eventuale copia in stock
      this.items = this.items.filter(
        (i) => !(i.inStock === true && i.name === item.name && i.categoryId === item.categoryId),
      );
    } else {
      // 🟥 Eliminazione dallo STOCK
      // rimuovo solo la copia in stock
      this.items = this.items.filter((i) => i.id !== id);
    }

    return of(true).pipe(delay(800));
  }

  deleteCatalogueItem(id: string): Observable<boolean> {
    this.items = this.items.filter((i) => i.id !== id);
    return of(true).pipe(delay(800));
  }
}
