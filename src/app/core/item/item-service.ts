import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Item } from './item.interface';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items: Item[] = [
    { id: '1', name: 'Carta A4 (risma)', status: 1, categoryId: '1' },
    { id: '2', name: 'Penne biro', status: 1, categoryId: '1' },
    { id: '3', name: 'Spillatrice', status: 0, categoryId: '1' },
    { id: '4', name: 'Kit pronto soccorso', status: 1, categoryId: '2' },
    { id: '5', name: 'Estintore', status: 1, categoryId: '3' },
    { id: '6', name: 'Badge accesso', status: 0, categoryId: '3' },
    { id: '7', name: 'Macchinetta caffè', status: 1, categoryId: '4' },
  ];

  getByCategory(categoryId: string) {
    return of(this.items.filter((i) => i.categoryId === categoryId));
  }
}
