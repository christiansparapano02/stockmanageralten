import { Component, inject, signal, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Item } from '../../core/item/item.interface';
import { ItemMockService } from '../../core/item/item-mock.service';
import { StatusLabelPipe } from "../../shared/pipes/status.pipe.ts";

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [TableModule, ButtonModule, DatePipe, SkeletonModule, NgClass, StatusLabelPipe],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts implements OnInit {
  itemService = inject(ItemMockService);
  criticalItems = signal<Item[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);

    this.itemService.getCritical().subscribe({
      next: (data) => {
        this.criticalItems.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getStatusClass(item: Item): string {
    if (item.quantity === 0) return 'badge-critical';
    if (item.quantity < item.minQuantity) return 'badge-low';
    return 'badge-ok';
  }

  onRestock(item: Item) {
    // TODO: implementare quando il backend sarà pronto
  }
}