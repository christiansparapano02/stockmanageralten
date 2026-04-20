import { Location } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, InputTextModule, TextareaModule, SelectModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support implements OnInit {
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  logged = signal(true);

  location = inject(Location);

  loading = signal(false);

  enteredObject = '';
  enteredDescription = '';
  enteredCategory = '';
  enteredFile = '';

  constructor(private router: Router) {}

  categoryOptions = [
  { label: 'Login Issues',     value: 'accesso' },
  { label: 'Inventory Error',  value: 'inventario' },
  { label: 'Category Issue',   value: 'categorie' },
  { label: 'Interface Issue',  value: 'ui' },
  { label: 'Other',            value: 'altro' },
];

selectedCategory = '';

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  onClick() {
    if (this.logged()) {
      window.alert(
        'Il ticket di supporto è stato inviato\nStai venendo reindirizzato alla schermata di login...',
      );
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } else {
      window.alert(
        'Il ticket di supporto è stato inviato\nStai venendo reindirizzato alla schermata principale...',
      );
      setTimeout(() => {
        this.router.navigate(['/categories']);
      }, 1500);
    }
  }

  onSubmit(category: string, object: string, description: string, file: string) {
    console.log(`
      Category: ${category}
      Object: ${object}
      Description: ${description}
      File: ${file}`);
  }

  onCancel() {
    this.location.back();
  }
}
