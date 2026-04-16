import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [ProgressSpinner, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support implements OnInit {
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  logged = signal(true);

  loading = signal(false);

  enteredObject = '';
  enteredDescription = '';
  enteredCategory = '';
  enteredFile = '';

  constructor(private router: Router) {}

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
      Categoria: ${category}
      Oggetto: ${object}
      Descrizione: ${description}
      File: ${file}`);
  }
}
