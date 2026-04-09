import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DarkModeService } from '../../core/dark_mode.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  darkModeService = inject(DarkModeService);
}
