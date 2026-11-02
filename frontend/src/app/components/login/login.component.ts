import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-5">
          <div class="bakery-card p-4 p-md-5">
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="login-icon-box mx-auto mb-3">
                <i class="bi bi-person-circle fs-2"></i>
              </div>
              <h2 class="fw-bold mb-1">Customer Login</h2>
              <p class="text-muted small">Welcome back! Please sign in to your bakery account</p>
            </div>

            <!-- Demo helper card for academic reviewers -->
            <div class="alert alert-light border small mb-4 py-2 px-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="badge bg-secondary me-1">Demo Customer:</span>
                  <code>rahul&#64;bakery.com</code> / <code>customer123</code>
                </div>
                <button
                  type="button"
                  class="btn btn-xs btn-outline-primary btn-sm py-0 px-2"
                  (click)="fillDemoCredentials()"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            <!-- Alerts -->
            <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i> {{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>

            <div *ngIf="successMessage" class="alert alert-success fade show" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
            </div>

            <!-- Login Form -->
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" novalidate>
              <!-- Email -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="e.g. rahul@bakery.com"
                    [(ngModel)]="email"
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

              <!-- Password -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Password <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    name="password"
                    class="form-control"
                    placeholder="Enter your password"
                    [(ngModel)]="password"
                    required
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
              </div>

              <!-- Submit button -->
              <button
                type="submit"
                class="btn btn-bakery-primary w-100 py-2 rounded-pill fw-bold"
                [disabled]="loginForm.invalid || submitting"
              >
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i *ngIf="!submitting" class="bi bi-box-arrow-in-right me-1"></i> Sign In
              </button>
            </form>

            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top small">
              <span class="text-muted">
                New customer?
                <a routerLink="/register" class="fw-bold text-decoration-none" style="color: var(--primary-brown);">
                  Sign up
                </a>
              </span>
              <a routerLink="/admin-login" class="text-decoration-none text-muted">
                <i class="bi bi-shield-lock me-1"></i> Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-icon-box {
      width: 60px;
      height: 60px;
      background-color: #F0E6DD;
      color: var(--primary-brown);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPassword = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  fillDemoCredentials(): void {
    this.email = 'rahul@bakery.com';
    this.password = 'customer123';
  }

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Login successful! Welcome back.';
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, 800);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
