import { Component, inject, signal, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Item } from '../../core/item/item.interface';
import { ItemService } from '../../core/item/item-service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [TableModule, ButtonModule, DatePipe],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts implements OnInit {
  itemService = inject(ItemService);
  criticalItems = signal<Item[]>([]);

  ngOnInit() {
    this.itemService.getCritical().subscribe((data) => {
      this.criticalItems.set(data);
    });
  }

  onRestock(item: Item) {
    // TODO: implementare quando il backend sarà pronto
  }
}
