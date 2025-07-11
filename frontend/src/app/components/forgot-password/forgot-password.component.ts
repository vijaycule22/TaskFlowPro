import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private router: Router) {}

  async onSubmit() {
    if (!this.email || !this.email.trim()) {
      this.showMessage('Please enter your email address', 'error');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const response: any = await this.http
        .post(`${environment.apiUrl}/auth/forgot-password`, {
          email: this.email.trim(),
        })
        .toPromise();

      this.showMessage(response.message, 'success');
      this.email = '';
    } catch (error: any) {
      console.error('Forgot password error:', error);
      this.showMessage(
        error.error?.message || 'An error occurred. Please try again.',
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
