import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="bakery-card p-4 p-md-5">
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="register-icon-box mx-auto mb-3">
                <i class="bi bi-person-plus-fill fs-2"></i>
              </div>
              <h2 class="fw-bold mb-1">Create Customer Account</h2>
              <p class="text-muted small">Sign up to enjoy freshly baked goodies delivered to your doorstep</p>
            </div>

            <!-- Alerts -->
            <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i> {{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>

            <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
            </div>

            <!-- Registration Form -->
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm" novalidate>
              <!-- Full Name -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="e.g. Rahul Sharma"
                    [(ngModel)]="formData.name"
                    required
                    #nameField="ngModel"
                    [class.is-invalid]="nameField.invalid && (nameField.dirty || nameField.touched)"
                  />
                </div>
                <div *ngIf="nameField.invalid && (nameField.dirty || nameField.touched)" class="text-danger small mt-1">
                  Please enter your full name.
                </div>
              </div>

              <!-- Email Address -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="name@example.com"
                    [(ngModel)]="formData.email"
                    required
                    email
                    #emailField="ngModel"
                    [class.is-invalid]="emailField.invalid && (emailField.dirty || emailField.touched)"
                  />
                </div>
                <div *ngIf="emailField.invalid && (emailField.dirty || emailField.touched)" class="text-danger small mt-1">
                  Please enter a valid email address.
                </div>
              </div>

              <!-- Mobile Number -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Mobile Number <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    class="form-control"
                    placeholder="10-digit mobile number"
                    [(ngModel)]="formData.phone"
                    required
                    pattern="[0-9]{10}"
                    #phoneField="ngModel"
                    [class.is-invalid]="phoneField.invalid && (phoneField.dirty || phoneField.touched)"
                  />
                </div>
                <div *ngIf="phoneField.invalid && (phoneField.dirty || phoneField.touched)" class="text-danger small mt-1">
                  Please enter a valid 10-digit mobile number.
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Password <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    name="password"
                    class="form-control"
                    placeholder="Minimum 6 characters"
                    [(ngModel)]="formData.password"
                    required
                    minlength="6"
                    #passwordField="ngModel"
                    [class.is-invalid]="passwordField.invalid && (passwordField.dirty || passwordField.touched)"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    (click)="showPassword = !showPassword"
                  >
                    <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
                <div *ngIf="passwordField.invalid && (passwordField.dirty || passwordField.touched)" class="text-danger small mt-1">
                  Password must be at least 6 characters.
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Confirm Password <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-lock-fill"></i></span>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    name="confirmPassword"
                    class="form-control"
                    placeholder="Re-enter your password"
                    [(ngModel)]="formData.confirmPassword"
                    required
                    #confirmField="ngModel"
                    [class.is-invalid]="formData.password !== formData.confirmPassword && (confirmField.dirty || confirmField.touched)"
                  />
                </div>
                <div
                  *ngIf="formData.password !== formData.confirmPassword && (confirmField.dirty || confirmField.touched)"
                  class="text-danger small mt-1"
                >
                  Passwords do not match.
                </div>
              </div>

              <!-- Submit button -->
              <button
                type="submit"
                class="btn btn-bakery-orange w-100 py-2 rounded-pill fw-bold"
                [disabled]="registerForm.invalid || formData.password !== formData.confirmPassword || submitting"
              >
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i *ngIf="!submitting" class="bi bi-check2-circle me-1"></i> Register Account
              </button>
            </form>

            <div class="text-center mt-4 pt-3 border-top">
              <p class="mb-0 text-muted small">
                Already have an account?
                <a routerLink="/login" class="fw-bold text-decoration-none" style="color: var(--primary-brown);">
                  Log in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-icon-box {
      width: 60px;
      height: 60px;
      background-color: #FCE8E2;
      color: var(--soft-orange);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  formData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please check your details.';
      }
    });
  }
}
