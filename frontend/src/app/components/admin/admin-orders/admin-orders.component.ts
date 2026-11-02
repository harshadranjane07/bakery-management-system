import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
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
                <a class="nav-link" routerLink="/admin/categories"><i class="bi bi-tags"></i> Manage Categories</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" routerLink="/admin/orders"><i class="bi bi-receipt"></i> Manage Orders</a>
              </li>
              <li class="nav-item mt-4 pt-3 border-top border-secondary">
                <a class="nav-link text-warning" routerLink="/products" target="_blank"><i class="bi bi-shop"></i> View Store</a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- MAIN ORDERS MANAGEMENT CONTENT -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark font-playfair mb-0">Customer Orders Management</h1>
              <small class="text-muted">Review incoming bakery orders, track status, and dispatch items</small>
            </div>
            <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="loadOrders()">
              <i class="bi bi-arrow-clockwise me-1"></i> Refresh Orders
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

          <!-- STATUS FILTER TABS -->
          <div class="d-flex flex-wrap gap-2 mb-4">
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'all' ? 'btn-bakery-primary' : 'btn-outline-secondary'"
              (click)="filterByStatus('all')"
            >
              All Orders ({{ orders.length }})
            </button>
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'Pending' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning'"
              (click)="filterByStatus('Pending')"
            >
              Pending
            </button>
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'Confirmed' ? 'btn-info text-dark fw-bold' : 'btn-outline-info'"
              (click)="filterByStatus('Confirmed')"
            >
              Confirmed
            </button>
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'Processing' ? 'btn-primary fw-bold' : 'btn-outline-primary'"
              (click)="filterByStatus('Processing')"
            >
              Processing
            </button>
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'Delivered' ? 'btn-success fw-bold' : 'btn-outline-success'"
              (click)="filterByStatus('Delivered')"
            >
              Delivered
            </button>
            <button
              class="btn btn-sm rounded-pill"
              [ngClass]="selectedFilter === 'Cancelled' ? 'btn-danger fw-bold' : 'btn-outline-danger'"
              (click)="filterByStatus('Cancelled')"
            >
              Cancelled
            </button>
          </div>

          <!-- LOADING SPINNER -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="text-muted mt-2">Loading customer orders...</p>
          </div>

          <!-- ORDERS LIST -->
          <div *ngIf="!loading && filteredOrders.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border">
            <i class="bi bi-inbox text-muted display-4"></i>
            <h5 class="mt-3">No orders found matching the filter "{{ selectedFilter }}".</h5>
          </div>

          <div *ngIf="!loading && filteredOrders.length > 0" class="d-flex flex-column gap-4">
            <div *ngFor="let order of filteredOrders" class="card border-0 shadow-sm rounded-4 overflow-hidden">
              <!-- Order Header -->
              <div class="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center border-bottom">
                <div>
                  <span class="text-muted small">ORDER ID:</span>
                  <span class="font-monospace fw-bold ms-1">#{{ order._id }}</span>
                  <span class="text-muted small ms-3">
                    <i class="bi bi-clock me-1"></i> {{ order.createdAt | date:'medium' }}
                  </span>
                </div>

                <!-- Update Status Inline Dropdown -->
                <div class="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                  <label class="small text-muted fw-bold mb-0">Status:</label>
                  <select
                    class="form-select form-select-sm fw-bold rounded-pill"
                    [ngClass]="getStatusBadge(order.orderStatus)"
                    style="width: 145px;"
                    [ngModel]="order.orderStatus"
                    (ngModelChange)="onStatusChange(order._id, $event)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <!-- Order Body -->
              <div class="card-body p-4">
                <div class="row g-4">
                  <!-- Customer Details -->
                  <div class="col-md-4 border-end">
                    <h6 class="fw-bold text-muted text-uppercase small mb-2">Customer & Shipping</h6>
                    <div class="small">
                      <strong class="fs-6 d-block text-dark">{{ order.shippingAddress.fullName }}</strong>
                      <span class="text-muted d-block">{{ order.shippingAddress.address }}</span>
                      <span class="text-muted d-block">{{ order.shippingAddress.city }} - {{ order.shippingAddress.pincode }}</span>
                      <div class="mt-2 text-muted">
                        <i class="bi bi-telephone-fill me-1 text-primary"></i> {{ order.shippingAddress.phone }}
                      </div>
                      <div class="mt-1 text-muted" *ngIf="getCustomerEmail(order.customer)">
                        <i class="bi bi-envelope-fill me-1 text-warning"></i> {{ getCustomerEmail(order.customer) }}
                      </div>
                      <div class="mt-2 pt-2 border-top">
                        <span class="badge bg-light text-dark border">
                          <i class="bi bi-wallet2 me-1"></i> {{ order.paymentMethod }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="col-md-8">
                    <h6 class="fw-bold text-muted text-uppercase small mb-2">Ordered Bakery Delights</h6>
                    <div class="d-flex flex-column gap-2 mb-3">
                      <div *ngFor="let item of order.items" class="d-flex align-items-center justify-content-between p-2 rounded bg-light">
                        <div class="d-flex align-items-center">
                          <img
                            [src]="item.imageUrl || defaultImg"
                            [alt]="item.name"
                            class="rounded me-2"
                            style="width: 40px; height: 40px; object-fit: cover;"
                          />
                          <div>
                            <span class="fw-semibold">{{ item.name }}</span>
                            <small class="text-muted d-block">₹{{ item.price }} &times; {{ item.quantity }}</small>
                          </div>
                        </div>
                        <span class="fw-bold">₹{{ item.price * item.quantity }}</span>
                      </div>
                    </div>

                    <div *ngIf="order.orderNotes" class="alert alert-warning py-2 px-3 small mb-3">
                      <i class="bi bi-info-circle-fill me-1"></i> Note: {{ order.orderNotes }}
                    </div>

                    <div class="d-flex justify-content-end align-items-baseline pt-2 border-top">
                      <span class="text-muted me-2">Grand Total:</span>
                      <span class="fs-4 fw-bold font-monospace" style="color: var(--primary-brown);">
                        ₹{{ order.totalAmount }}
                      </span>
                    </div>
                  </div>
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
export class AdminOrdersComponent implements OnInit {
  orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;
  selectedFilter = 'all';
  message = '';
  errorMessage = '';

  defaultImg = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (res.orders) {
          this.orders = res.orders;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedFilter = status;
  }

  get filteredOrders(): Order[] {
    if (this.selectedFilter === 'all') return this.orders;
    return this.orders.filter((o) => o.orderStatus === this.selectedFilter);
  }

  onStatusChange(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (res) => {
        this.message = `Order #${orderId.slice(-6)} status updated to "${newStatus}"!`;
        this.loadOrders();
        setTimeout(() => (this.message = ''), 3500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update order status';
      }
    });
  }

  getCustomerEmail(customer: any): string {
    if (typeof customer === 'object' && customer?.email) return customer.email;
    return '';
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Confirmed': return 'bg-info text-dark';
      case 'Processing': return 'bg-primary text-white';
      case 'Delivered': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
