import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from "primeng/button";

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule, InputTextModule, Button],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  
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
  }

}
