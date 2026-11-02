import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <!-- Breadcrumb & Title -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="display-6 fw-bold mb-1">Your Shopping Cart</h2>
          <p class="text-muted mb-0">Review your freshly baked treats before checking out</p>
        </div>
        <a routerLink="/products" class="btn btn-outline-secondary rounded-pill">
          <i class="bi bi-arrow-left me-1"></i> Continue Shopping
        </a>
      </div>

      <!-- Toast Alert -->
      <div *ngIf="alertMessage" class="alert alert-warning alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-circle-fill me-2"></i> {{ alertMessage }}
        <button type="button" class="btn-close" (click)="alertMessage = ''"></button>
      </div>

      <!-- EMPTY CART STATE -->
      <div *ngIf="items.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
        <div class="empty-cart-icon mx-auto mb-3">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
        </div>
        <h3 class="fw-bold mb-2">Your Cart is Currently Empty</h3>
        <p class="text-muted mb-4">
          You haven't added any delicious cakes or treats yet. Check out our oven-fresh menu!
        </p>
        <a routerLink="/products" class="btn btn-lg btn-bakery-orange rounded-pill px-5 shadow-sm">
          <i class="bi bi-bag-heart me-2"></i> Explore Bakery Menu
        </a>
      </div>

      <!-- CART CONTENT -->
      <div *ngIf="items.length > 0" class="row g-4">
        <!-- Cart Items List Table -->
        <div class="col-lg-8">
          <div class="bg-white rounded-4 shadow-sm border p-4">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style="width: 140px;">Quantity</th>
                    <th>Subtotal</th>
                    <th class="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items">
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          [src]="item.product.imageUrl"
                          [alt]="item.product.name"
                          class="rounded-3 me-3"
                          style="width: 65px; height: 65px; object-fit: cover;"
                        />
                        <div>
                          <h6 class="mb-0 fw-bold">{{ item.product.name }}</h6>
                          <small class="text-muted">Stock: {{ item.product.stock }} available</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="fw-semibold">₹{{ item.product.price }}</span>
                    </td>
                    <td>
                      <div class="input-group input-group-sm">
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          (click)="decrement(item)"
                        >
                          <i class="bi bi-dash"></i>
                        </button>
                        <span class="input-group-text bg-white px-3 fw-bold">
                          {{ item.quantity }}
                        </span>
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          (click)="increment(item)"
                          [disabled]="item.quantity >= item.product.stock"
                        >
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <span class="fw-bold text-dark">₹{{ item.product.price * item.quantity }}</span>
                    </td>
                    <td class="text-end">
                      <button
                        class="btn btn-sm text-danger border-0"
                        title="Remove item"
                        (click)="removeItem(item.product._id)"
                      >
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Clear Cart Button -->
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button class="btn btn-sm btn-outline-danger rounded-pill" (click)="clearCart()">
                <i class="bi bi-trash me-1"></i> Clear Cart
              </button>
              <span class="text-muted small">
                <i class="bi bi-box-seam me-1"></i> {{ totalItemsCount }} item(s) in cart
              </span>
            </div>
          </div>
        </div>

        <!-- Order Summary Card -->
        <div class="col-lg-4">
          <div class="bg-white rounded-4 shadow-sm border p-4">
            <h4 class="fw-bold mb-4 font-playfair">Order Summary</h4>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal:</span>
              <span class="fw-semibold">₹{{ subtotal }}</span>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Estimated Tax (5% GST):</span>
              <span class="fw-semibold">₹{{ tax }}</span>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Delivery Charges:</span>
              <span [ngClass]="deliveryCharges === 0 ? 'text-success fw-bold' : 'fw-semibold'">
                {{ deliveryCharges === 0 ? 'FREE' : '₹' + deliveryCharges }}
              </span>
            </div>

            <div *ngIf="subtotal < 499" class="alert alert-info py-2 px-3 small my-3">
              <i class="bi bi-info-circle me-1"></i> Add <strong>₹{{ 499 - subtotal }}</strong> more to get <strong>Free Delivery</strong>!
            </div>

            <hr class="my-3" />

            <div class="d-flex justify-content-between align-items-baseline mb-4">
              <span class="fs-5 fw-bold">Grand Total:</span>
              <span class="display-6 fw-bold" style="color: var(--primary-brown);">
                ₹{{ grandTotal }}
              </span>
            </div>

            <a routerLink="/checkout" class="btn btn-lg btn-bakery-orange w-100 rounded-pill fw-bold shadow-sm">
              <i class="bi bi-bag-check-fill me-2"></i> Proceed to Checkout
            </a>

            <div class="text-center mt-3 text-muted small">
              <i class="bi bi-shield-lock-fill text-success me-1"></i> Safe & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-cart-icon {
      width: 80px;
      height: 80px;
      background: #FAF3EB;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);

  items: CartItem[] = [];
  alertMessage = '';

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.items = items;
    });
  }

  get totalItemsCount(): number {
    return this.cartService.getTotalCount();
  }

  get subtotal(): number {
    return this.cartService.getTotalAmount();
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.05);
  }

  get deliveryCharges(): number {
    if (this.subtotal === 0) return 0;
    return this.subtotal >= 499 ? 0 : 50;
  }

  get grandTotal(): number {
    if (this.subtotal === 0) return 0;
    return this.subtotal + this.tax + this.deliveryCharges;
  }

  increment(item: CartItem): void {
    const res = this.cartService.updateQuantity(item.product._id, item.quantity + 1);
    if (!res.success && res.message) {
      this.alertMessage = res.message;
      setTimeout(() => (this.alertMessage = ''), 3000);
    }
  }

  decrement(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity - 1);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
      this.cartService.clearCart();
    }
  }
}
