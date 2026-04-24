import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'app-speed-dial',
  standalone: true,
  imports: [SpeedDialModule],
  templateUrl: './speed-dial.html',
  styleUrl: './speed-dial.css',
})
export class SpeedDial {
  @Input() items: MenuItem[] = [];

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  emitAdd() {
    this.add.emit();
  }
  emitEdit() {
    this.edit.emit();
  }
  emitDelete() {
    this.delete.emit();
  }
}
