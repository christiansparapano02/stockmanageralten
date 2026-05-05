import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule, InputTextModule, Button, ProgressSpinner, Toast],
  providers: [MessageService],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class ForgotPassword implements OnInit {
  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  constructor(private router: Router) {}

  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get emailIsInvalid() {
    return (
      this.loginForm.controls.email.touched &&
      this.loginForm.controls.email.dirty &&
      this.loginForm.controls.email.invalid
    );
  }

  onSubmit() {
    console.log(this.loginForm);

    this.messageService.add({
      severity: 'info',
      summary: "L'email è stata inviata con successo!",
      detail: 'Verrai rinviato alla pagina di login...',
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
    
  }
}
