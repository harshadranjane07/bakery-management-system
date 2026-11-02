import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
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
                <a class="nav-link" routerLink="/admin/products"><i class="bi bi-box-seam"></i> Manage Products</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" routerLink="/admin/categories"><i class="bi bi-tags"></i> Manage Categories</a>
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

        <!-- MAIN CATEGORY CRUD CONTENT -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark font-playfair mb-0">Bakery Category Management</h1>
              <small class="text-muted">Organize your baked goods into intuitive categories</small>
            </div>
            <button class="btn btn-bakery-orange rounded-pill px-4" (click)="openAddModal()">
              <i class="bi bi-plus-circle me-1"></i> Add Category
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

          <!-- ADD / EDIT CATEGORY FORM -->
          <div *ngIf="showModal" class="card shadow border-0 rounded-4 mb-4 bg-light p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold mb-0 font-playfair">
                <i class="bi" [ngClass]="isEditMode ? 'bi-pencil-square text-primary' : 'bi-plus-circle text-success'"></i>
                {{ isEditMode ? 'Edit Category' : 'Create New Bakery Category' }}
              </h4>
              <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="closeModal()">
                <i class="bi bi-x-lg"></i> Cancel
              </button>
            </div>

            <form (ngSubmit)="saveCategory()" #catForm="ngForm">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Category Name <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="e.g. Sourdough Breads"
                    [(ngModel)]="currentCategory.name"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    class="form-control"
                    placeholder="https://images.unsplash.com/..."
                    [(ngModel)]="currentCategory.imageUrl"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Category Description</label>
                  <textarea
                    name="description"
                    class="form-control"
                    rows="2"
                    placeholder="Brief description of this bakery product category..."
                    [(ngModel)]="currentCategory.description"
                  ></textarea>
                </div>
                <div class="col-12 text-end mt-3">
                  <button type="button" class="btn btn-outline-secondary me-2 rounded-pill px-4" (click)="closeModal()">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-bakery-primary rounded-pill px-4" [disabled]="catForm.invalid || submitting">
                    <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="bi bi-check2 me-1"></i> {{ isEditMode ? 'Update Category' : 'Save Category' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- CATEGORIES GRID -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
          </div>

          <div *ngIf="!loading" class="row g-4">
            <div *ngFor="let cat of categories" class="col-md-6 col-lg-4">
              <div class="bakery-card h-100 p-3">
                <div class="d-flex align-items-center mb-3">
                  <img
                    [src]="cat.imageUrl || defaultImg"
                    [alt]="cat.name"
                    class="rounded-circle me-3"
                    style="width: 60px; height: 60px; object-fit: cover; border: 2px solid var(--border-soft);"
                  />
                  <div>
                    <h5 class="fw-bold mb-0 text-dark">{{ cat.name }}</h5>
                    <small class="text-muted">ID: {{ cat._id | slice: -6 }}</small>
                  </div>
                </div>
                <p class="text-muted small mb-3" style="min-height: 40px;">
                  {{ cat.description || 'No description provided.' }}
                </p>
                <div class="d-flex justify-content-end gap-2 border-top pt-2">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3" (click)="openEditModal(cat)">
                    <i class="bi bi-pencil-fill me-1"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger rounded-pill px-3" (click)="deleteCategory(cat)">
                    <i class="bi bi-trash3-fill me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AdminCategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = true;
  submitting = false;
  showModal = false;
  isEditMode = false;
  message = '';
  errorMessage = '';

  defaultImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80';

  currentCategory: any = {
    _id: '',
    name: '',
    description: '',
    imageUrl: ''
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        if (res.categories) {
          this.categories = res.categories;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentCategory = {
      _id: '',
      name: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
    };
    this.showModal = true;
  }

  openEditModal(cat: Category): void {
    this.isEditMode = true;
    this.currentCategory = {
      _id: cat._id,
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCategory(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.message = '';

    if (this.isEditMode) {
      this.categoryService
        .updateCategory(this.currentCategory._id, {
          name: this.currentCategory.name,
          description: this.currentCategory.description,
          imageUrl: this.currentCategory.imageUrl
        })
        .subscribe({
          next: () => {
            this.submitting = false;
            this.showModal = false;
            this.message = 'Category updated successfully!';
            this.loadCategories();
          },
          error: (err) => {
            this.submitting = false;
            this.errorMessage = err.error?.message || 'Failed to update category';
          }
        });
    } else {
      this.categoryService
        .createCategory({
          name: this.currentCategory.name,
          description: this.currentCategory.description,
          imageUrl: this.currentCategory.imageUrl
        })
        .subscribe({
          next: () => {
            this.submitting = false;
            this.showModal = false;
            this.message = 'Category created successfully!';
            this.loadCategories();
          },
          error: (err) => {
            this.submitting = false;
            this.errorMessage = err.error?.message || 'Failed to create category';
          }
        });
    }
  }

  deleteCategory(cat: Category): void {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      this.categoryService.deleteCategory(cat._id).subscribe({
        next: (res) => {
          this.message = res.message || 'Category deleted successfully';
          this.loadCategories();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete category';
        }
      });
    }
  }
}
