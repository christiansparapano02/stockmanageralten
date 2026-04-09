import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../core/dark_mode.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  darkModeService = inject(DarkModeService);

  offices = [
    { label: 'Genova', value: 'Genova' },
    { label: 'Milano', value: 'Milano' },
    { label: 'Brescia', value: 'Brescia' },
    { label: 'Torino', value: 'Torino' },
    { label: 'Bologna', value: 'Bologna' },
    { label: 'Modena', value: 'Modena' },
    { label: 'Verona', value: 'Verona' },
    { label: 'La Spezia', value: 'La Spezia' },
    { label: 'Roma', value: 'Roma' },
    { label: 'Napoli', value: 'Napoli' },
    { label: 'Firenze', value: 'Firenze' },
    { label: 'Bari', value: 'Bari' },
    { label: 'Gallarate', value: 'Gallarate' },
  ];

  officeControl = new FormControl('Bari');
}
