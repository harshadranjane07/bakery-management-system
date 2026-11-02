import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div>
      <!-- HEADER BANNER -->
      <section class="page-header-banner">
        <div class="container">
          <h1 class="display-5 fw-bold">Bakery Product Menu</h1>
          <p>Explore our fresh handcrafted collection of artisanal cakes, breads, pastries, and treats</p>
        </div>
      </section>

      <div class="container mb-5">
        <!-- Toast Notification -->
        <div *ngIf="cartToastMessage" class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i> {{ cartToastMessage }}
          <button type="button" class="btn-close" (click)="cartToastMessage = ''"></button>
        </div>

        <!-- SEARCH AND FILTER CONTROLS -->
        <div class="bg-white p-4 rounded-4 shadow-sm mb-4 border">
          <div class="row g-3 align-items-center">
            <!-- Search bar -->
            <div class="col-md-5">
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control bg-light border-start-0"
                  placeholder="Search products by name or description..."
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="applyFilters()"
                />
                <button class="btn btn-bakery-primary" type="button" (click)="applyFilters()">
                  Search
                </button>
              </div>
            </div>

            <!-- Category Filter Dropdown -->
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-funnel text-muted"></i>
                </span>
                <select class="form-select bg-light" [(ngModel)]="selectedCategory" (change)="applyFilters()">
                  <option value="all">All Categories</option>
                  <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
                </select>
              </div>
            </div>

            <!-- Sort By -->
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-sort-down text-muted"></i>
                </span>
                <select class="form-select bg-light" [(ngModel)]="selectedSort" (change)="applyFilters()">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Quick Category Pills -->
          <div class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedCategory === 'all' ? 'btn-bakery-primary' : 'btn-outline-secondary'"
              (click)="filterByCategory('all')"
            >
              All ({{ products.length }})
            </button>
            <button
              *ngFor="let cat of categories"
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedCategory === cat._id ? 'btn-bakery-primary' : 'btn-outline-secondary'"
              (click)="filterByCategory(cat._id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- LOADING SPINNER -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status"></div>
          <p class="text-muted mt-2">Loading bakery products from MongoDB...</p>
        </div>

        <!-- NO PRODUCTS FOUND -->
        <div *ngIf="!loading && products.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
          <i class="bi bi-basket3 text-muted display-1"></i>
          <h4 class="mt-3">No Products Found</h4>
          <p class="text-muted">Try adjusting your search criteria or select another category.</p>
          <button class="btn btn-bakery-primary rounded-pill px-4" (click)="resetFilters()">
            Clear Filters
          </button>
        </div>

        <!-- PRODUCTS GRID -->
        <div *ngIf="!loading && products.length > 0" class="row g-4">
          <div *ngFor="let product of products" class="col-sm-6 col-lg-4 col-xl-3">
            <div class="bakery-card h-100 d-flex flex-column">
              <!-- Product Image & Badges -->
              <div class="position-relative product-img-box">
                <img [src]="product.imageUrl" [alt]="product.name" class="card-img-top" />
                
                <!-- Category badge -->
                <span class="badge bg-light text-dark position-absolute top-0 start-0 m-2 rounded-pill shadow-sm">
                  {{ getCategoryName(product.category) }}
                </span>

                <!-- Stock badge -->
                <span
                  class="badge position-absolute top-0 end-0 m-2 rounded-pill shadow-sm"
                  [ngClass]="product.stock > 0 ? (product.stock <= 5 ? 'bg-warning text-dark' : 'bg-success') : 'bg-danger'"
                >
                  <i class="bi" [ngClass]="product.stock > 0 ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ product.stock > 0 ? (product.stock <= 5 ? 'Low: ' + product.stock + ' left' : 'In Stock: ' + product.stock) : 'Out of Stock' }}
                </span>
              </div>

              <!-- Product Details -->
              <div class="card-body d-flex flex-column p-3">
                <h5 class="card-title fw-bold mb-1 text-truncate" [title]="product.name">
                  {{ product.name }}
                </h5>
                
                <p class="card-text text-muted small flex-grow-1 mb-3 product-desc">
                  {{ product.description }}
                </p>

                <div class="d-flex justify-content-between align-items-baseline mb-3">
                  <div>
                    <span class="price-tag">₹{{ product.price }}</span>
                    <small class="text-muted"> / {{ product.unit || 'piece' }}</small>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2">
                  <a [routerLink]="['/products', product._id]" class="btn btn-sm btn-outline-secondary rounded-pill flex-fill">
                    <i class="bi bi-eye"></i> Details
                  </a>
                  <button
                    class="btn btn-sm btn-bakery-orange rounded-pill flex-fill"
                    [disabled]="product.stock <= 0"
                    (click)="addToCart(product)"
                  >
                    <i class="bi bi-cart-plus me-1"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-img-box {
      height: 180px;
      overflow: hidden;
    }
    .product-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .bakery-card:hover .product-img-box img {
      transform: scale(1.05);
    }
    .product-desc {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 38px;
    }
  `]
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  cartToastMessage = '';

  searchQuery = '';
  selectedCategory = 'all';
  selectedSort = 'newest';

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        if (res.categories) {
          this.categories = res.categories;
        }
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProducts({
        search: this.searchQuery,
        category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
        sort: this.selectedSort
      })
      .subscribe({
        next: (res) => {
          if (res.products) {
            this.products = res.products;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.loadProducts();
  }

  applyFilters(): void {
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedSort = 'newest';
    this.loadProducts();
  }

  getCategoryName(category: any): string {
    if (!category) return 'Bakery';
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    const found = this.categories.find((c) => c._id === category);
    return found ? found.name : 'Bakery';
  }

  addToCart(product: Product): void {
    const result = this.cartService.addToCart(product, 1);
    this.cartToastMessage = result.message;
    setTimeout(() => {
      this.cartToastMessage = '';
    }, 3500);
  }
}
