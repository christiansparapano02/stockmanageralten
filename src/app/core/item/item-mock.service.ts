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

    // STOCK (già presenti, collegati al catalogo tramite catalogueItemId)
    {
      id: 's1',
      name: 'Carta A4 (risma)',
      categoryId: '1',
      quantity: 15,
      minQuantity: 10,
      inStock: true,
      catalogueItemId: '1',
    },
    {
      id: 's2',
      name: 'Penne biro',
      categoryId: '1',
      quantity: 30,
      minQuantity: 10,
      inStock: true,
      catalogueItemId: '2',
    },
    {
      id: 's3',
      name: 'Spillatrice',
      categoryId: '1',
      quantity: 1,
      minQuantity: 5,
      inStock: true,
      catalogueItemId: '3',
    },
    {
      id: 's4',
      name: 'Kit pronto soccorso',
      categoryId: '2',
      quantity: 3,
      minQuantity: 2,
      inStock: true,
      catalogueItemId: '4',
    },
    {
      id: 's5',
      name: 'Estintore',
      categoryId: '3',
      quantity: 4,
      minQuantity: 2,
      inStock: true,
      catalogueItemId: '5',
    },
    {
      id: 's6',
      name: 'Badge accesso',
      categoryId: '3',
      quantity: 0,
      minQuantity: 5,
      inStock: true,
      catalogueItemId: '6',
    },
    {
      id: 's7',
      name: 'Macchinetta caffè',
      categoryId: '4',
      quantity: 2,
      minQuantity: 1,
      inStock: true,
      catalogueItemId: '7',
    },
  ];

  getAll(): Observable<Item[]> {
    return of([...this.items.filter((i) => !i.inStock)]).pipe(delay(800));
  }

  getByCategory(categoryId: string): Observable<Item[]> {
    return of([...this.items.filter((i) => i.categoryId === categoryId && i.inStock)]).pipe(
      delay(800),
    );
  }

  getCatalogueByCategory(categoryId: string): Observable<Item[]> {
    const inStockCatalogueIds = this.items
      .filter((i) => i.categoryId === categoryId && i.inStock && i.catalogueItemId)
      .map((i) => i.catalogueItemId);

    return of([
      ...this.items.filter(
        (i) => i.categoryId === categoryId && !i.inStock && !inStockCatalogueIds.includes(i.id),
      ),
    ]).pipe(delay(800));
  }

  getCritical(): Observable<Item[]> {
    return of([...this.items.filter((i) => i.inStock && i.quantity === 0)]).pipe(delay(800));
  }

  add(item: Omit<Item, 'id'>): Observable<Item> {
    const newItem: Item = { ...item, id: crypto.randomUUID() };
    this.items.push(newItem);
    return of(newItem).pipe(delay(800));
  }

  update(updatedItem: Item): Observable<Item> {
    const index = this.items.findIndex((i) => i.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = { ...updatedItem };
    }

    // se è un item del catalogo, aggiorna nome e minQuantity negli item in stock collegati
    if (!updatedItem.inStock) {
      this.items = this.items.map((i) => {
        if (i.inStock && i.catalogueItemId === updatedItem.id) {
          return { ...i, name: updatedItem.name, minQuantity: updatedItem.minQuantity };
        }
        return i;
      });
    }

    return of(updatedItem).pipe(delay(800));
  }

  delete(id: string): Observable<boolean> {
    const item = this.items.find((i) => i.id === id);
    if (!item) return of(false);

    if (item.inStock) {
      // eliminazione dallo stock — rimuove solo questo item
      this.items = this.items.filter((i) => i.id !== id);
    }

    return of(true).pipe(delay(800));
  }

  deleteCatalogueItem(id: string): Observable<boolean> {
    // rimuove solo l'item del catalogo, non tocca lo stock
    this.items = this.items.filter((i) => i.id !== id);
    return of(true).pipe(delay(800));
  }
}
