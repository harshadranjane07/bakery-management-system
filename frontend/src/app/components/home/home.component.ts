import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <!-- HERO BANNER -->
      <section class="hero-section position-relative text-white d-flex align-items-center">
        <div class="hero-overlay"></div>
        <div class="container position-relative py-5">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
                <i class="bi bi-fire me-1"></i> Fresh From The Oven Daily
              </span>
              <h1 class="display-3 fw-bold mb-3 hero-heading">
                Baked With Passion, <br />
                Served With Love.
              </h1>
              <p class="lead mb-4 hero-subtitle">
                Experience the magic of handcrafted artisanal cakes, flaky pastries, crusty sourdough breads, and melt-in-the-mouth brownies.
              </p>
              <div class="d-flex flex-wrap gap-3">
                <a routerLink="/products" class="btn btn-lg btn-bakery-orange rounded-pill px-4 shadow">
                  <i class="bi bi-bag-heart me-2"></i> Explore Our Menu
                </a>
                <a routerLink="/products" [queryParams]="{ featured: true }" class="btn btn-lg btn-outline-light rounded-pill px-4">
                  <i class="bi bi-star-fill text-warning me-2"></i> Featured Bakes
                </a>
              </div>
            </div>
            <div class="col-lg-5 text-center mt-4 mt-lg-0">
              <div class="hero-image-wrapper p-3 bg-white bg-opacity-10 rounded-4 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80"
                  alt="Artisanal Breads & Bakes"
                  class="img-fluid rounded-4 shadow"
                  style="max-height: 380px; object-fit: cover; width: 100%;"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- HIGHLIGHT FEATURES -->
      <section class="py-4 bg-white border-bottom shadow-sm">
        <div class="container">
          <div class="row g-4 text-center">
            <div class="col-6 col-md-3">
              <div class="d-flex align-items-center justify-content-center">
                <i class="bi bi-clock-history fs-2 text-danger me-3"></i>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold">Baked Fresh Daily</h6>
                  <small class="text-muted">Early morning batches</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="d-flex align-items-center justify-content-center">
                <i class="bi bi-shield-check fs-2 text-success me-3"></i>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold">100% Pure Butter</h6>
                  <small class="text-muted">No preservatives</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="d-flex align-items-center justify-content-center">
                <i class="bi bi-truck fs-2 text-primary me-3"></i>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold">Fast Local Delivery</h6>
                  <small class="text-muted">Warm at your doorstep</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="d-flex align-items-center justify-content-center">
                <i class="bi bi-award fs-2 text-warning me-3"></i>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold">Artisan Recipes</h6>
                  <small class="text-muted">Traditional craft</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- POPULAR CATEGORIES -->
      <section class="py-5">
        <div class="container">
          <div class="text-center mb-5">
            <span class="text-uppercase fw-bold text-muted small" style="letter-spacing: 2px;">DELICIOUS SELECTIONS</span>
            <h2 class="display-6 fw-bold">Popular Bakery Categories</h2>
            <div class="divider mx-auto my-2"></div>
            <p class="text-muted">Browse our wide variety of freshly crafted bakery delights</p>
          </div>

          <div *ngIf="loadingCategories" class="text-center py-4">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="text-muted mt-2">Loading categories...</p>
          </div>

          <div *ngIf="!loadingCategories" class="row g-4">
            <div *ngFor="let cat of categories" class="col-6 col-md-4 col-lg-3">
              <a [routerLink]="['/products']" [queryParams]="{ category: cat._id }" class="text-decoration-none">
                <div class="bakery-card text-center p-3 h-100 category-box">
                  <div class="category-img-wrapper mb-3 mx-auto">
                    <img [src]="cat.imageUrl || defaultCatImg" [alt]="cat.name" class="img-fluid" />
                  </div>
                  <h5 class="fw-bold mb-1 text-dark">{{ cat.name }}</h5>
                  <p class="small text-muted mb-0 text-truncate">{{ cat.description || 'Fresh handcrafted treat' }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED PRODUCTS -->
      <section class="py-5 bg-white">
        <div class="container">
          <div class="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span class="text-uppercase fw-bold text-muted small" style="letter-spacing: 2px;">CHEF'S SPECIAL</span>
              <h2 class="display-6 fw-bold mb-1">Featured Bakery Delights</h2>
              <p class="text-muted mb-0">Our top customer favorites hand-picked for you today</p>
            </div>
            <a routerLink="/products" class="btn btn-outline-dark rounded-pill px-4 mt-3 mt-md-0">
              View Full Menu <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>

          <!-- Alert Toast -->
          <div *ngIf="cartAlert" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> {{ cartAlert }}
            <button type="button" class="btn-close" (click)="cartAlert = ''"></button>
          </div>

          <div *ngIf="loadingProducts" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="text-muted mt-2">Fetching delicious products...</p>
          </div>

          <div *ngIf="!loadingProducts" class="row g-4">
            <div *ngFor="let product of featuredProducts" class="col-md-6 col-lg-4">
              <div class="bakery-card h-100 d-flex flex-column">
                <div class="position-relative product-img-box">
                  <img [src]="product.imageUrl" [alt]="product.name" class="card-img-top" />
                  <span class="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill px-3 py-1">
                    Featured
                  </span>
                  <span
                    class="badge position-absolute bottom-0 start-0 m-2 rounded-pill px-2 py-1"
                    [ngClass]="product.stock > 0 ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ product.stock > 0 ? 'In Stock (' + product.stock + ')' : 'Out of Stock' }}
                  </span>
                </div>
                <div class="card-body d-flex flex-column p-4">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title fw-bold mb-0 text-dark">{{ product.name }}</h5>
                    <span class="price-tag">₹{{ product.price }}</span>
                  </div>
                  <p class="card-text text-muted small flex-grow-1">
                    {{ product.description }}
                  </p>
                  <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <a [routerLink]="['/products', product._id]" class="btn btn-sm btn-link text-decoration-none p-0 text-brown">
                      View Details <i class="bi bi-chevron-right"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-bakery-orange rounded-pill px-3"
                      [disabled]="product.stock <= 0"
                      (click)="addToCart(product)"
                    >
                      <i class="bi bi-cart-plus me-1"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SHORT BAKERY INTRODUCTION STORY -->
      <section class="py-5" style="background-color: #F7EFE5;">
        <div class="container">
          <div class="row align-items-center g-5">
            <div class="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80"
                alt="Bakery Oven and Fresh Breads"
                class="img-fluid rounded-4 shadow"
              />
            </div>
            <div class="col-lg-6">
              <span class="badge bg-dark text-warning px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
                Our Story
              </span>
              <h2 class="display-6 fw-bold mb-3">Pure Ingredients, Old-World Baking Heritage</h2>
              <p class="text-muted">
                Started as a local student-led culinary vision, <strong>The Golden Crust Bakery</strong> is dedicated
                to restoring the art of authentic slow-fermented breads and preservative-free cakes.
              </p>
              <p class="text-muted">
                Every recipe is carefully measured, folded, and baked in small batches. We use real dairy butter, rich Dutch cocoa,
                pure vanilla beans, and unbleached grain flours to deliver unforgettable taste in every bite.
              </p>
              <div class="row g-3 pt-2">
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                    <span class="fw-semibold">100% Eggless Options</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                    <span class="fw-semibold">Custom Birthday Cakes</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                    <span class="fw-semibold">Hygienic Baking Kitchen</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                    <span class="fw-semibold">Eco-Friendly Packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="py-5 bg-white">
        <div class="container">
          <div class="text-center mb-5">
            <span class="text-uppercase fw-bold text-muted small" style="letter-spacing: 2px;">HAPPY CUSTOMERS</span>
            <h2 class="display-6 fw-bold">What Our Patrons Say</h2>
            <div class="divider mx-auto my-2"></div>
          </div>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="bakery-card p-4 h-100 text-center">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="text-muted small fst-italic">
                  "The Chocolate Cake ordered for my brother's birthday was extraordinary! Rich ganache, perfectly balanced sweetness, and delivered within 40 minutes."
                </p>
                <h6 class="fw-bold mb-0">Priya Kulkarni</h6>
                <small class="text-muted">Pune</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="bakery-card p-4 h-100 text-center">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="text-muted small fst-italic">
                  "Their sourdough bread and chocolate chip cookies are unmatched in town. Genuine artisanal quality at very reasonable student-friendly prices."
                </p>
                <h6 class="fw-bold mb-0">Amit Deshmukh</h6>
                <small class="text-muted">Food Blogger</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="bakery-card p-4 h-100 text-center">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="text-muted small fst-italic">
                  "Smooth ordering experience and the brownies are so fudgy and warm. Definitely ordering again for our college fest!"
                </p>
                <h6 class="fw-bold mb-0">Sneha Patil</h6>
                <small class="text-muted">College Student</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION BANNER -->
      <section class="py-5 text-white text-center" style="background: linear-gradient(135deg, #4A2E18 0%, #2A170A 100%);">
        <div class="container py-4">
          <h2 class="display-6 fw-bold mb-3 text-white">Craving Something Sweet & Warm?</h2>
          <p class="lead mb-4 text-light-cream">Order your favorite bakery items online now and enjoy fresh home delivery.</p>
          <a routerLink="/products" class="btn btn-lg btn-bakery-orange rounded-pill px-5 shadow">
            Order Fresh Bakes Now <i class="bi bi-arrow-right ms-2"></i>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      background: url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat;
      min-height: 520px;
    }
    .hero-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, rgba(46, 27, 14, 0.92) 0%, rgba(46, 27, 14, 0.75) 60%, rgba(46, 27, 14, 0.5) 100%);
    }
    .hero-heading {
      font-family: 'Playfair Display', serif;
      line-height: 1.15;
    }
    .hero-subtitle {
      color: #F5E5D8;
      max-width: 540px;
    }
    .divider {
      width: 60px;
      height: 3px;
      background-color: var(--soft-orange);
      border-radius: 2px;
    }
    .category-box {
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .category-box:hover {
      border-color: var(--light-brown);
      transform: translateY(-5px);
    }
    .category-img-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--border-soft);
    }
    .category-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-img-box {
      height: 200px;
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
    .text-brown {
      color: var(--primary-brown);
      font-weight: 600;
    }
  `]
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);

  categories: Category[] = [];
  featuredProducts: Product[] = [];
  loadingCategories = true;
  loadingProducts = true;
  cartAlert = '';

  defaultCatImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80';

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        if (res.categories) {
          this.categories = res.categories;
        }
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (res) => {
        if (res.products) {
          this.featuredProducts = res.products;
        }
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  addToCart(product: Product): void {
    const result = this.cartService.addToCart(product, 1);
    this.cartAlert = result.message;
    setTimeout(() => {
      this.cartAlert = '';
    }, 3500);
  }
}
