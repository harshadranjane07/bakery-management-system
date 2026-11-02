import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- ADMIN SIDEBAR -->
        <nav class="col-md-3 col-lg-2 d-md-block admin-sidebar p-3 shadow">
          <div class="sidebar-sticky">
            <div class="text-center py-3 mb-3 border-bottom border-secondary">
              <i class="bi bi-shield-lock text-warning display-6 mb-2 d-block"></i>
              <h5 class="text-white mb-0 font-playfair">Admin Control</h5>
              <small class="text-white-50">Bakery Management</small>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard"><i class="bi bi-speedometer2"></i> Dashboard Overview</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" routerLink="/admin/products"><i class="bi bi-box-seam"></i> Manage Products</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories"><i class="bi bi-tags"></i> Manage Categories</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/orders"><i class="bi bi-receipt"></i> Manage Orders</a>
              </li>
              <li class="nav-item mt-4 pt-3 border-top border-secondary">
                <a class="nav-link text-warning" routerLink="/products" target="_blank"><i class="bi bi-shop"></i> View Store</a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- MAIN PRODUCT CRUD CONTENT -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark font-playfair mb-0">Bakery Product Management (CRUD)</h1>
              <small class="text-muted">Create, edit, restock, and manage products stored in MongoDB</small>
            </div>
            <button class="btn btn-bakery-orange rounded-pill px-4" (click)="openAddModal()">
              <i class="bi bi-plus-circle me-1"></i> Add New Product
            </button>
          </div>

          <!-- Toast Messages -->
          <div *ngIf="message" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> {{ message }}
            <button type="button" class="btn-close" (click)="message = ''"></button>
          </div>
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
          </div>

          <!-- ADD / EDIT PRODUCT MODAL OR INLINE CARD -->
          <div *ngIf="showModal" class="card shadow border-0 rounded-4 mb-4 bg-light p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold mb-0 font-playfair">
                <i class="bi" [ngClass]="isEditMode ? 'bi-pencil-square text-primary' : 'bi-plus-circle text-success'"></i>
                {{ isEditMode ? 'Edit Product' : 'Add New Bakery Product' }}
              </h4>
              <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="closeModal()">
                <i class="bi bi-x-lg"></i> Cancel
              </button>
            </div>

            <form (ngSubmit)="saveProduct()" #prodForm="ngForm">
              <div class="row g-3">
                <!-- Product Name -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Product Name <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="e.g. Belgian Chocolate Truffle Cake"
                    [(ngModel)]="currentProduct.name"
                    required
                  />
                </div>

                <!-- Category -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Category <span class="text-danger">*</span></label>
                  <select
                    name="category"
                    class="form-select"
                    [(ngModel)]="currentProduct.category"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
                  </select>
                </div>

                <!-- Price (INR) -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Price (₹ INR) <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text">₹</span>
                    <input
                      type="number"
                      name="price"
                      class="form-control"
                      placeholder="e.g. 450"
                      [(ngModel)]="currentProduct.price"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <!-- Stock Quantity -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Stock Quantity <span class="text-danger">*</span></label>
                  <input
                    type="number"
                    name="stock"
                    class="form-control"
                    placeholder="Available count"
                    [(ngModel)]="currentProduct.stock"
                    min="0"
                    required
                  />
                </div>

                <!-- Unit -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Unit Type</label>
                  <select name="unit" class="form-select" [(ngModel)]="currentProduct.unit">
                    <option value="piece">Piece</option>
                    <option value="kg">Kg</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                    <option value="slice">Slice</option>
                  </select>
                </div>

                <!-- Image URL or File Upload -->
                <div class="col-md-8">
                  <label class="form-label fw-semibold">Image URL or Upload Below</label>
                  <input
                    type="url"
                    name="imageUrl"
                    class="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    [(ngModel)]="currentProduct.imageUrl"
                  />
                </div>

                <!-- File upload input -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Upload Local Image</label>
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                  />
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label class="form-label fw-semibold">Product Description <span class="text-danger">*</span></label>
                  <textarea
                    name="description"
                    class="form-control"
                    rows="3"
                    placeholder="Detailed ingredients, taste profile, and allergen info..."
                    [(ngModel)]="currentProduct.description"
                    required
                  ></textarea>
                </div>

                <!-- Featured checkbox -->
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="isFeatured"
                      id="isFeatured"
                      [(ngModel)]="currentProduct.isFeatured"
                    />
                    <label class="form-check-label fw-semibold" for="isFeatured">
                      Display on Homepage Featured Carousel
                    </label>
                  </div>
                </div>

                <div class="col-12 mt-4 text-end">
                  <button type="button" class="btn btn-outline-secondary me-2 rounded-pill px-4" (click)="closeModal()">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-bakery-primary rounded-pill px-4"
                    [disabled]="prodForm.invalid || submitting"
                  >
                    <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="bi bi-check2 me-1"></i> {{ isEditMode ? 'Update Product' : 'Save Product' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- PRODUCTS DATA TABLE -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold font-playfair">All Bakery Products ({{ products.length }})</h5>
              <div class="input-group" style="max-width: 280px;">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Filter table..."
                  [(ngModel)]="filterQuery"
                />
              </div>
            </div>

            <div *ngIf="loading" class="text-center py-5">
              <div class="spinner-border text-warning" role="status"></div>
            </div>

            <div *ngIf="!loading" class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light small">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Featured</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let prod of filteredProducts">
                    <td>
                      <img
                        [src]="prod.imageUrl"
                        [alt]="prod.name"
                        class="rounded-3 shadow-sm"
                        style="width: 50px; height: 50px; object-fit: cover;"
                      />
                    </td>
                    <td>
                      <strong class="d-block text-dark">{{ prod.name }}</strong>
                      <small class="text-muted text-truncate d-inline-block" style="max-width: 220px;">
                        {{ prod.description }}
                      </small>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark border">
                        {{ getCategoryName(prod.category) }}
                      </span>
                    </td>
                    <td>
                      <span class="fw-bold font-monospace">₹{{ prod.price }}</span>
                      <small class="text-muted">/{{ prod.unit || 'pc' }}</small>
                    </td>
                    <td>
                      <span
                        class="badge rounded-pill px-2 py-1"
                        [ngClass]="prod.stock > 0 ? (prod.stock <= 5 ? 'bg-warning text-dark' : 'bg-success') : 'bg-danger'"
                      >
                        {{ prod.stock }} left
                      </span>
                    </td>
                    <td>
                      <i *ngIf="prod.isFeatured" class="bi bi-star-fill text-warning" title="Featured"></i>
                      <span *ngIf="!prod.isFeatured" class="text-muted">&mdash;</span>
                    </td>
                    <td class="text-end">
                      <button
                        class="btn btn-sm btn-outline-primary me-2 rounded-circle"
                        title="Edit Product"
                        (click)="openEditModal(prod)"
                      >
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger rounded-circle"
                        title="Delete Product"
                        (click)="deleteProduct(prod)"
                      >
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="filteredProducts.length === 0">
                    <td colspan="7" class="text-center py-4 text-muted">No bakery products found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AdminProductsComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  submitting = false;
  showModal = false;
  isEditMode = false;
  message = '';
  errorMessage = '';
  filterQuery = '';

  selectedFile: File | null = null;

  currentProduct: any = {
    _id: '',
    name: '',
    category: '',
    price: 0,
    stock: 0,
    unit: 'piece',
    imageUrl: '',
    description: '',
    isFeatured: false
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
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
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.products) {
          this.products = res.products;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  get filteredProducts(): Product[] {
    if (!this.filterQuery.trim()) return this.products;
    const q = this.filterQuery.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        this.getCategoryName(p.category).toLowerCase().includes(q)
    );
  }

  getCategoryName(category: any): string {
    if (!category) return '';
    if (typeof category === 'object' && category.name) return category.name;
    const found = this.categories.find((c) => c._id === category);
    return found ? found.name : 'Unknown';
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedFile = null;
    this.currentProduct = {
      _id: '',
      name: '',
      category: this.categories.length > 0 ? this.categories[0]._id : '',
      price: 0,
      stock: 10,
      unit: 'piece',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      description: '',
      isFeatured: false
    };
    this.showModal = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedFile = null;
    const catId = typeof product.category === 'object' ? (product.category as any)._id : product.category;

    this.currentProduct = {
      _id: product._id,
      name: product.name,
      category: catId,
      price: product.price,
      stock: product.stock,
      unit: product.unit || 'piece',
      imageUrl: product.imageUrl,
      description: product.description,
      isFeatured: product.isFeatured || false
    };
    this.showModal = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveProduct(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.message = '';

    const formData = new FormData();
    formData.append('name', this.currentProduct.name);
    formData.append('category', this.currentProduct.category);
    formData.append('price', String(this.currentProduct.price));
    formData.append('stock', String(this.currentProduct.stock));
    formData.append('unit', this.currentProduct.unit);
    formData.append('description', this.currentProduct.description);
    formData.append('isFeatured', String(this.currentProduct.isFeatured));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.currentProduct.imageUrl) {
      formData.append('imageUrl', this.currentProduct.imageUrl);
    }

    if (this.isEditMode) {
      this.productService.updateProduct(this.currentProduct._id, formData).subscribe({
        next: (res) => {
          this.submitting = false;
          this.showModal = false;
          this.message = 'Product updated successfully!';
          this.loadProducts();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.message || 'Failed to update product';
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.submitting = false;
          this.showModal = false;
          this.message = 'Product added to bakery inventory successfully!';
          this.loadProducts();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.message || 'Failed to create product';
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}" from inventory?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: (res) => {
          this.message = res.message || 'Product deleted successfully';
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete product';
        }
      });
    }
  }
}
