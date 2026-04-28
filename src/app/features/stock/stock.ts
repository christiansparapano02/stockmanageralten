import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';

import { Item } from '../../core/item/item.interface';
import { StatusLabelPipe } from '../../shared/pipes/status.pipe.ts';
import { ITEM_SERVICE_TOKEN } from '../../core/item/item-service.token';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    NgClass,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ConfirmDialogModule,
    StatusLabelPipe,
    SkeletonModule,
    DatePickerModule,
    SelectModule,
    MenuModule,
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

  items = signal<Item[]>([]);
  categoryId = signal<string>('');
  dialogVisible = signal(false);
  editDialogVisible = signal(false);
  addQtyVisible = signal(false);
  removeQtyVisible = signal(false);
  loading = signal(false);

  catalogueItems = signal<Item[]>([]);
  selectedCatalogueItem = signal<Item | null>(null);
  selectedItem = signal<Item | null>(null);
  editingItem = signal<Item | null>(null);

  visible = false;
  qtyAmount = 1;
  selectedRowIndex = signal<number>(-1);

  newItem = signal<Omit<Item, 'id'>>({
    name: '',
    status: 1,
    nextCheck: undefined,
    expiring: undefined,
    categoryId: '',
    quantity: 0,
    minQuantity: 1,
  });

  rowMenuItems = [
    {
      label: 'Options',
      items: [
        {
          label: 'Details',
          icon: 'pi pi-info-circle',
          command: () => this.showDetails(this.selectedItem()!),
        },
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => this.openEditDialog(this.selectedItem()!),
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => this.confirmDelete(this.selectedItem()!),
        },
      ],
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
      error: () => this.loading.set(false),
    });
  }

  computeStatus(item: Pick<Item, 'quantity' | 'minQuantity'>): number {
    return item.quantity < item.minQuantity ? 0 : 1;
  }

  getStatusClass(item: Item): string {
    if (item.quantity === 0) return 'badge-critical';
    if (item.quantity < item.minQuantity) return 'badge-low';
    return 'badge-ok';
  }

  openRowMenu(event: Event, item: Item, menu: any) {
    this.selectedItem.set(item);
    menu.toggle(event);
  }

  showDetails(item: Item) {
    this.selectedItem.set(item);
    this.visible = true;
  }

  openEditDialog(item: Item) {
    this.editingItem.set({ ...item });
    this.editDialogVisible.set(true);
  }

  saveEditedItem() {
    const updated = this.editingItem();
    if (!updated) return;
    const withStatus = { ...updated, status: this.computeStatus(updated) };
    this.itemService.update(withStatus).subscribe(() => {
      this.items.update((current) => current.map((i) => (i.id === withStatus.id ? withStatus : i)));
      this.editDialogVisible.set(false);
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
    };

    this.itemService.add(itemToSave).subscribe((created) => {
      this.items.update((current) => [...current, created]);
      this.dialogVisible.set(false);
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

  openAddDialog(rowIndex: number) {
    this.selectedRowIndex.set(rowIndex);
    this.qtyAmount = 1;
    this.addQtyVisible.set(true);
  }

  openRemoveDialog(rowIndex: number) {
    this.selectedRowIndex.set(rowIndex);
    this.qtyAmount = 1;
    this.removeQtyVisible.set(true);
  }

  confirmAddQty() {
    const idx = this.selectedRowIndex();
    if (idx === -1) return;
    const items = [...this.items()];
    items[idx] = { ...items[idx], quantity: items[idx].quantity + this.qtyAmount };
    this.items.set(items);
    this.addQtyVisible.set(false);
  }

  confirmRemoveQty() {
    const idx = this.selectedRowIndex();
    if (idx === -1) return;
    const items = [...this.items()];
    const newQty = Math.max(0, items[idx].quantity - this.qtyAmount);
    items[idx] = { ...items[idx], quantity: newQty };
    this.items.set(items);
    this.removeQtyVisible.set(false);
  }
}
