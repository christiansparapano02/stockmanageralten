import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../core/item/item.interface';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(item: Pick<Item, 'quantity' | 'minQuantity'>): string {
    if (item.quantity === 0) return 'Critico';
    if (item.quantity < item.minQuantity) return 'Basso';
    return 'OK';
  }
}
