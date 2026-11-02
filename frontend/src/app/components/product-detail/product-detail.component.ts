import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <!-- Back button -->
      <a routerLink="/products" class="btn btn-outline-secondary rounded-pill mb-4">
        <i class="bi bi-arrow-left me-1"></i> Back to Products
      </a>

      <!-- Toast Message -->
      <div *ngIf="message" class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i> {{ message }}
        <button type="button" class="btn-close" (click)="message = ''"></button>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="text-muted mt-2">Loading product details...</p>
      </div>

      <div *ngIf="!loading && product" class="bg-white rounded-4 shadow-sm p-4 p-md-5 border">
        <div class="row g-5 align-items-center">
          <!-- Product Image -->
          <div class="col-lg-6">
            <div class="product-large-img-wrapper rounded-4 overflow-hidden border shadow-sm">
              <img [src]="product.imageUrl" [alt]="product.name" class="img-fluid w-100" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-6">
            <div class="mb-3">
              <span class="badge bg-light text-dark px-3 py-2 rounded-pill me-2 border">
                {{ getCategoryName(product.category) }}
              </span>
              <span
                class="badge px-3 py-2 rounded-pill"
                [ngClass]="product.stock > 0 ? (product.stock <= 5 ? 'bg-warning text-dark' : 'bg-success') : 'bg-danger'"
              >
                {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
              </span>
            </div>

            <h1 class="display-6 fw-bold mb-3">{{ product.name }}</h1>

            <div class="d-flex align-items-baseline mb-4">
              <span class="display-6 fw-bold text-dark me-2">₹{{ product.price }}</span>
              <span class="text-muted">/ {{ product.unit || 'piece' }} (inclusive of all taxes)</span>
            </div>

            <div class="mb-4">
              <h6 class="fw-bold text-uppercase text-muted small">Description & Ingredients:</h6>
              <p class="lead fs-6 text-muted">{{ product.description }}</p>
            </div>

            <div class="features-box p-3 rounded-3 bg-light mb-4">
              <div class="row g-2 small text-muted">
                <div class="col-6"><i class="bi bi-check2 text-success me-1"></i> Baked fresh today</div>
                <div class="col-6"><i class="bi bi-check2 text-success me-1"></i> 100% Vegetarian options</div>
                <div class="col-6"><i class="bi bi-check2 text-success me-1"></i> Hygienic packaging</div>
                <div class="col-6"><i class="bi bi-check2 text-success me-1"></i> Delivery in 45 mins</div>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="d-flex flex-wrap align-items-center gap-3 pt-2" *ngIf="product.stock > 0">
              <div class="input-group" style="width: 140px;">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  (click)="decreaseQty()"
                  [disabled]="selectedQty <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  class="form-control text-center bg-white"
                  [(ngModel)]="selectedQty"
                  min="1"
                  [max]="product.stock"
                  readonly
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  (click)="increaseQty()"
                  [disabled]="selectedQty >= product.stock"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <button
                class="btn btn-lg btn-bakery-orange rounded-pill px-4 shadow-sm"
                (click)="addToCart()"
              >
                <i class="bi bi-cart-plus me-2"></i> Add to Cart (₹{{ product.price * selectedQty }})
              </button>
            </div>

            <div *ngIf="product.stock <= 0" class="alert alert-warning mt-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              This freshly baked item is currently sold out. Please check back in a few hours for the next oven batch!
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-large-img-wrapper {
      max-height: 450px;
    }
    .product-large-img-wrapper img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  product: Product | null = null;
  loading = true;
  selectedQty = 1;
  message = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        if (res.product) {
          this.product = res.product;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCategoryName(category: any): string {
    if (!category) return 'Bakery Delight';
    if (typeof category === 'object' && category.name) return category.name;
    return 'Bakery Delight';
  }

  increaseQty(): void {
    if (this.product && this.selectedQty < this.product.stock) {
      this.selectedQty++;
    }
  }

  decreaseQty(): void {
    if (this.selectedQty > 1) {
      this.selectedQty--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    const res = this.cartService.addToCart(this.product, this.selectedQty);
    this.message = res.message;
    setTimeout(() => {
      this.message = '';
    }, 3500);
  }
}
