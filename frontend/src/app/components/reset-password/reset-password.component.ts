import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  isValidating: boolean = true;
  isValidToken: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.validateToken();
      } else {
        this.isValidating = false;
        this.isValidToken = false;
        this.showMessage(
          'Invalid reset link. Please request a new password reset.',
          'error'
        );
      }
    });
  }

  async validateToken() {
    try {
      const response: any = await this.http
        .get(
          `${environment.apiUrl}/auth/validate-reset-token?token=${this.token}`
        )
        .toPromise();
      this.isValidToken = response.valid;
      if (!response.valid) {
        this.showMessage(
          response.message || 'Invalid or expired reset token.',
          'error'
        );
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      this.isValidToken = false;
      this.showMessage(
        'Failed to validate reset token. Please try again.',
        'error'
      );
    } finally {
      this.isValidating = false;
    }
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const response: any = await this.http
        .post(`${environment.apiUrl}/auth/reset-password`, {
          token: this.token,
          newPassword: this.newPassword,
        })
        .toPromise();

      this.showMessage(response.message, 'success');
      this.newPassword = '';
      this.confirmPassword = '';

      // Redirect to login after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      this.showMessage(
        error.error?.message || 'An error occurred. Please try again.',
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.newPassword || !this.newPassword.trim()) {
      this.showMessage('Please enter a new password', 'error');
      return false;
    }

    if (this.newPassword.length < 6) {
      this.showMessage('Password must be at least 6 characters long', 'error');
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return false;
    }

    return true;
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
