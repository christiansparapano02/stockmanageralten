import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Item } from '../../core/item/item.interface';
import { ITEM_SERVICE_TOKEN } from '../../core/item/item-service.token';
import { StatusLabelPipe } from '../../shared/pipes/status.pipe.ts';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ConfirmDialogModule,
    StatusLabelPipe,
    SkeletonModule,
    SelectModule,
    MenuModule,
    DatePickerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock implements OnInit {
  route = inject(ActivatedRoute);
  itemService = inject(ITEM_SERVICE_TOKEN);
  confirmationService = inject(ConfirmationService);
  destroyRef = inject(DestroyRef);

  @ViewChild('rowMenu') rowMenu!: Menu;

  items = signal<Item[]>([]);
  categoryId = signal<string>('');

  loading = signal(false);

  dialogVisible = signal(false);

  editDialogVisible = signal(false);

  selectedItem = signal<Item | null>(null);

  editingItem = signal<Item | null>(null);

  catalogueItems = signal<Item[]>([]);
  selectedCatalogueItem = signal<Item | null>(null);

  newItem = signal<Omit<Item, 'id'>>({
    name: '',
    status: 1,
    nextCheck: undefined,
    expiring: undefined,
    categoryId: '',
    quantity: 0,
    minQuantity: 1,
  });

  rowMenuItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        const item = this.selectedItem();

        if (item) {
          this.openEditDialog(item);
        }
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        const item = this.selectedItem();

        if (item) {
          this.confirmDelete(item);
        }
      },
    },
  ];

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.categoryId.set(params['category']);
      this.loadItems();
    });
  }

  loadItems() {
    this.loading.set(true);

    this.itemService.getByCategory(this.categoryId()).subscribe({
      next: (data) => {
        const normalized = data.map((item) => ({
          ...item,
          status: this.computeStatus(item),
        }));

        this.items.set(normalized);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  computeStatus(item: Pick<Item, 'quantity' | 'minQuantity'>): number {
    return item.quantity < item.minQuantity ? 0 : 1;
  }

  openRowMenu(event: MouseEvent, item: Item) {
    this.selectedItem.set(item);
    this.rowMenu.toggle(event);
  }

  openEditDialog(item: Item) {
    this.editingItem.set({ ...item });
    this.editDialogVisible.set(true);
  }

  saveEditedItem() {
    const item = this.editingItem();

    if (!item) return;

    const updated = {
      ...item,
      status: this.computeStatus(item),
    };

    this.itemService.update(updated).subscribe((saved) => {
      this.items.update((items) => items.map((i) => (i.id === saved.id ? saved : i)));

      this.editDialogVisible.set(false);
      this.editingItem.set(null);
    });
  }

  handleAdd() {
    this.newItem.set({
      name: '',
      status: 1,
      nextCheck: undefined,
      expiring: undefined,
      categoryId: this.categoryId(),
      quantity: 0,
      minQuantity: 1,
    });

    this.itemService.getCatalogueByCategory(this.categoryId()).subscribe((data) => {
      this.catalogueItems.set(data);
    });

    this.dialogVisible.set(true);
  }

  saveNewItem() {
    const selected = this.selectedCatalogueItem();

    if (!selected) return;

    const itemToSave: Omit<Item, 'id'> = {
      name: selected.name,
      categoryId: this.categoryId(),
      minQuantity: selected.minQuantity,
      quantity: this.newItem().quantity,
      status: this.computeStatus({
        quantity: this.newItem().quantity,
        minQuantity: selected.minQuantity,
      }),
      inStock: true,
      catalogueItemId: selected.id,
    };

    this.itemService.add(itemToSave).subscribe((created) => {
      this.items.update((current) => [...current, created]);

      this.dialogVisible.set(false);

      this.selectedCatalogueItem.set(null);
    });
  }

  confirmDelete(item: Item) {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',

      message: `Are you sure you want to delete "${item.name}"?`,

      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Delete',

      rejectLabel: 'Cancel',

      accept: () => {
        this.itemService.delete(item.id).subscribe(() => {
          this.items.update((current) => current.filter((i) => i.id !== item.id));
        });
      },
    });
  }
}
