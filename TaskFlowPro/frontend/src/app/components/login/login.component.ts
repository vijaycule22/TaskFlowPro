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
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: '',
  };
  loading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.error = 'Please fill in all fields';
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all fields',
      });
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
        });
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.error =
          error.error?.message ||
          'Login failed. Please check your credentials.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Login failed',
        });
        this.loading = false;
      },
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
