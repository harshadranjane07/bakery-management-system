import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm custom-navbar">
      <div class="container">
        <!-- Brand Logo & Name -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <div class="brand-icon-wrapper me-2">
            <i class="bi bi-cake2-fill"></i>
          </div>
          <div>
            <div class="brand-title">The Golden Crust</div>
            <div class="brand-subtitle">ARTISANAL BAKERY</div>
          </div>
        </a>

        <!-- Mobile Toggle Button -->
        <button
          class="navbar-toggler"
          type="button"
          (click)="isCollapsed = !isCollapsed"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            
            <!-- ADMIN LOGGED IN NAVIGATION -->
            <ng-container *ngIf="authService.isAdmin()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-speedometer2 me-1"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/products" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-box-seam me-1"></i> Manage Products
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-tags me-1"></i> Manage Categories
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/orders" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-receipt me-1"></i> Manage Orders
                </a>
              </li>
              <li class="nav-item ms-lg-2">
                <span class="badge bg-danger rounded-pill px-3 py-2 me-2">Admin Portal</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-sm btn-outline-light rounded-pill px-3 py-1" (click)="onLogout()">
                  <i class="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </li>
            </ng-container>

            <!-- CUSTOMER LOGGED IN NAVIGATION -->
            <ng-container *ngIf="authService.isCustomer()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="isCollapsed = true">
                  <i class="bi bi-house-door me-1"></i> Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/products" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-grid me-1"></i> Products
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-cart3 me-1"></i> My Cart
                  <span
                    *ngIf="cartCount > 0"
                    class="badge bg-warning text-dark rounded-pill ms-1 position-relative"
                    style="top: -2px;"
                  >
                    {{ cartCount }}
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/my-orders" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-bag-check me-1"></i> My Orders
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/profile" routerLinkActive="active" (click)="isCollapsed = true">
                  <i class="bi bi-person me-1"></i> Profile
                </a>
              </li>
              <li class="nav-item ms-lg-2">
                <span class="text-white-50 me-3 small">Hi, {{ authService.currentUserValue?.name }}</span>
                <button class="btn btn-sm btn-outline-light rounded-pill px-3 py-1" (click)="onLogout()">
                  <i class="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </li>
            </ng-container>

            <!-- LOGGED OUT / GUEST NAVIGATION -->
            <ng-container *ngIf="!authService.isAuthenticated()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="isCollapsed = true">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/products" routerLinkActive="active" (click)="isCollapsed = true">
                  Products
                </a>
              </li>
              <li class="nav-item ms-lg-2">
                <a class="nav-link" routerLink="/cart" (click)="isCollapsed = true">
                  <i class="bi bi-cart3"></i>
                  <span *ngIf="cartCount > 0" class="badge bg-warning text-dark rounded-pill ms-1">{{ cartCount }}</span>
                </a>
              </li>
              <li class="nav-item ms-lg-2">
                <a class="btn btn-sm btn-outline-light rounded-pill px-3 py-1 me-2" routerLink="/login" (click)="isCollapsed = true">
                  Login
                </a>
              </li>
              <li class="nav-item">
                <a class="btn btn-sm btn-bakery-orange rounded-pill px-3 py-1" routerLink="/register" (click)="isCollapsed = true">
                  Sign Up
                </a>
              </li>
            </ng-container>

          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .custom-navbar {
      background-color: var(--primary-brown);
      padding: 0.75rem 0;
      border-bottom: 2px solid #5A391E;
    }
    .brand-icon-wrapper {
      width: 38px;
      height: 38px;
      background: var(--soft-orange);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.25rem;
    }
    .brand-title {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 1.35rem;
      line-height: 1.1;
      color: #FFFDF9;
      letter-spacing: 0.5px;
    }
    .brand-subtitle {
      font-size: 0.65rem;
      letter-spacing: 2px;
      color: var(--golden-crust);
      font-weight: 600;
    }
    .nav-link {
      color: #FAF3EB !important;
      font-weight: 500;
      padding: 0.5rem 0.85rem !important;
      transition: color 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--golden-crust) !important;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  isCollapsed = true;

  get cartCount(): number {
    return this.cartService.getTotalCount();
  }

  onLogout(): void {
    this.isCollapsed = true;
    this.authService.logout();
  }
}
