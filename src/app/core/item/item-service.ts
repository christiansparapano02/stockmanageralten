import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Item } from './item.interface';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items: Item[] = [
    {
      id: '1',
      name: 'Carta A4 (risma)',
      status: 1,
      categoryId: '1',
      quantity: 15,
      minQuantity: 10,
    },
    { id: '2', name: 'Penne biro', status: 1, categoryId: '1', quantity: 30, minQuantity: 10 },
    { id: '3', name: 'Spillatrice', status: 0, categoryId: '1', quantity: 1, minQuantity: 5 },
    {
      id: '4',
      name: 'Kit pronto soccorso',
      status: 1,
      categoryId: '2',
      quantity: 3,
      minQuantity: 2,
    },
    { id: '5', name: 'Estintore', status: 1, categoryId: '3', quantity: 4, minQuantity: 2 },
    { id: '6', name: 'Badge accesso', status: 0, categoryId: '3', quantity: 0, minQuantity: 5 },
    { id: '7', name: 'Macchinetta caffè', status: 1, categoryId: '4', quantity: 2, minQuantity: 1 },
  ];

  getByCategory(categoryId: string) {
    return of(this.items.filter((i) => i.categoryId === categoryId));
  }

  getCritical() {
    return of(this.items.filter((i) => i.status === 0));
  }

  add(item: Omit<Item, 'id'>) {
    const newItem: Item = {
      ...item,
      id: crypto.randomUUID(),
    };

    this.items.push(newItem);
    return of(newItem);
  }

  update(updatedItem: Item) {
    const index = this.items.findIndex((i) => i.id === updatedItem.id);

    if (index !== -1) {
      this.items[index] = { ...updatedItem };
    }

    return of(updatedItem);
  }

  delete(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
    return of(true);
  }
}
