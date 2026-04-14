import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [SpeedDialModule],
  templateUrl: './options.html',
  styleUrl: './options.css',
})
export class Options {
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  items: MenuItem[] = [
    {
      icon: 'pi pi-trash',
      command: () => this.onDelete.emit(),
    },
    {
      icon: 'pi pi-pencil',
      command: () => this.onEdit.emit(),
    },
    {
      icon: 'pi pi-plus',
      command: () => this.onAdd.emit(),
    },
  ];

  handleAdd() {
    console.log('ADD');
  }

  handleEdit() {
    console.log('EDIT');
  }

  handleDelete() {
    console.log('DELETE');
  }
}
