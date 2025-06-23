import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    email: '',
    password: '',
    name: '',
  };
  confirmPassword = '';
  loading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
    if (
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.name
    ) {
      this.error = 'Please fill in all fields';
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all fields',
      });
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Passwords do not match',
      });
      return;
    }

    if (this.registerData.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password must be at least 6 characters long',
      });
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful!',
        });
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.error =
          error.error?.message || 'Registration failed. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Registration failed',
        });
        this.loading = false;
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
