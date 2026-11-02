import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <!-- Header -->
            <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
              <div class="profile-avatar me-3">
                <i class="bi bi-person-fill fs-2"></i>
              </div>
              <div>
                <h3 class="fw-bold mb-0">{{ profileData.name || 'Customer Profile' }}</h3>
                <span class="badge bg-secondary rounded-pill text-uppercase">{{ profileData.role || 'Customer' }}</span>
                <span class="text-muted ms-2 small">{{ profileData.email }}</span>
              </div>
            </div>

            <!-- Toast Messages -->
            <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
              <button type="button" class="btn-close" (click)="successMessage = ''"></button>
            </div>
            <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i> {{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>

            <!-- Form -->
            <form (ngSubmit)="updateProfile()">
              <h5 class="fw-bold mb-3 text-muted font-playfair">Personal Details</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Full Name</label>
                  <input type="text" class="form-control" name="name" [(ngModel)]="profileData.name" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email Address (Read-only)</label>
                  <input type="email" class="form-control bg-light" name="email" [value]="profileData.email" readonly />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Mobile Number</label>
                  <input type="tel" class="form-control" name="phone" [(ngModel)]="profileData.phone" required />
                </div>
              </div>

              <h5 class="fw-bold mb-3 text-muted font-playfair pt-2 border-top">Default Delivery Address</h5>
              <div class="row g-3 mb-4">
                <div class="col-12">
                  <label class="form-label fw-semibold">Street / Building Address</label>
                  <input
                    type="text"
                    class="form-control"
                    name="street"
                    placeholder="e.g. Flat 301, Lakeview Residency"
                    [(ngModel)]="profileData.address.street"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">City</label>
                  <input type="text" class="form-control" name="city" [(ngModel)]="profileData.address.city" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">State</label>
                  <input type="text" class="form-control" name="state" [(ngModel)]="profileData.address.state" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">PIN Code</label>
                  <input type="text" class="form-control" name="pincode" [(ngModel)]="profileData.address.pincode" />
                </div>
              </div>

              <button type="submit" class="btn btn-bakery-primary rounded-pill px-4" [disabled]="saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i *ngIf="!saving" class="bi bi-save me-1"></i> Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-avatar {
      width: 60px;
      height: 60px;
      background-color: #FAF3EB;
      border: 2px solid var(--light-brown);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-brown);
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);

  profileData = {
    name: '',
    email: '',
    phone: '',
    role: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  };

  saving = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.user) {
          this.profileData = {
            name: res.user.name || '',
            email: res.user.email || '',
            phone: res.user.phone || '',
            role: res.user.role || 'customer',
            address: {
              street: res.user.address?.street || '',
              city: res.user.address?.city || '',
              state: res.user.address?.state || '',
              pincode: res.user.address?.pincode || ''
            }
          };
        }
      }
    });
  }

  updateProfile(): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService
      .updateProfile({
        name: this.profileData.name,
        phone: this.profileData.phone,
        address: this.profileData.address
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to update profile';
        }
      });
  }
}
