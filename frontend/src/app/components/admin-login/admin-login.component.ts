import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-5">
          <div class="admin-login-card p-4 p-md-5">
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="admin-shield-icon mx-auto mb-3">
                <i class="bi bi-shield-lock-fill fs-2"></i>
              </div>
              <span class="badge bg-danger rounded-pill px-3 py-1 text-uppercase mb-2" style="letter-spacing: 1.5px; font-size: 0.75rem;">
                Authorized Staff Only
              </span>
              <h2 class="fw-bold mb-1 text-white">Admin Portal Login</h2>
              <p class="text-white-50 small">Access the bakery inventory, category, and order control center</p>
            </div>

            <!-- Demo helper card -->
            <div class="admin-demo-box p-3 rounded-3 mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="small text-light">
                  <span class="badge bg-warning text-dark me-1">Default Admin:</span><br />
                  <code>admin&#64;bakery.com</code> / <code>admin123</code>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-warning rounded-pill"
                  (click)="fillAdminDemo()"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            <!-- Alerts -->
            <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-octagon-fill me-2"></i> {{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>

            <div *ngIf="successMessage" class="alert alert-success fade show" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
            </div>

            <!-- Admin Form -->
            <form (ngSubmit)="onSubmit()" #adminForm="ngForm" novalidate>
              <div class="mb-3">
                <label class="form-label text-light fw-semibold">Admin Email <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-dark text-warning border-secondary">
                    <i class="bi bi-person-badge"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    class="form-control bg-dark text-white border-secondary"
                    placeholder="admin@bakery.com"
                    [(ngModel)]="email"
                    required
                    email
                    #emailField="ngModel"
                    [class.is-invalid]="emailField.invalid && (emailField.dirty || emailField.touched)"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label text-light fw-semibold">Password <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-dark text-warning border-secondary">
                    <i class="bi bi-key-fill"></i>
                  </span>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    name="password"
                    class="form-control bg-dark text-white border-secondary"
                    placeholder="Enter admin password"
                    [(ngModel)]="password"
                    required
                    #passwordField="ngModel"
                    [class.is-invalid]="passwordField.invalid && (passwordField.dirty || passwordField.touched)"
                  />
                  <button
                    class="btn btn-outline-secondary text-light"
                    type="button"
                    (click)="showPassword = !showPassword"
                  >
                    <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-warning w-100 py-2 rounded-pill fw-bold text-dark shadow"
                [disabled]="adminForm.invalid || submitting"
              >
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i *ngIf="!submitting" class="bi bi-unlock-fill me-1"></i> Authenticate Admin
              </button>
            </form>

            <div class="text-center mt-4 pt-3 border-top border-secondary">
              <a routerLink="/login" class="text-decoration-none text-white-50 small">
                <i class="bi bi-arrow-left me-1"></i> Return to Customer Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-card {
      background: linear-gradient(145deg, #331F0F 0%, #1E1107 100%);
      border: 1px solid #5A391E;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .admin-shield-icon {
      width: 65px;
      height: 65px;
      background-color: rgba(233, 196, 106, 0.15);
      color: var(--golden-crust);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--golden-crust);
    }
    .admin-demo-box {
      background: rgba(255, 255, 255, 0.06);
      border: 1px dashed rgba(233, 196, 106, 0.4);
    }
  `]
})
export class AdminLoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPassword = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  fillAdminDemo(): void {
    this.email = 'admin@bakery.com';
    this.password = 'admin123';
  }

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Admin verified! Redirecting to Dashboard...';
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, 800);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Admin authentication failed. Access restricted.';
      }
    });
  }
}
