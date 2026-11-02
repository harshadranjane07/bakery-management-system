import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { OrderService } from '../../../services/order.service';
import { DashboardStats } from '../../../models/dashboard.model';
import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
                <a class="nav-link active" routerLink="/admin/dashboard">
                  <i class="bi bi-speedometer2"></i> Dashboard Overview
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/products">
                  <i class="bi bi-box-seam"></i> Manage Products
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories">
                  <i class="bi bi-tags"></i> Manage Categories
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/orders">
                  <i class="bi bi-receipt"></i> Manage Orders
                </a>
              </li>
              <li class="nav-item mt-4 pt-3 border-top border-secondary">
                <a class="nav-link text-warning" routerLink="/products" target="_blank">
                  <i class="bi bi-shop"></i> View Customer Store
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- MAIN DASHBOARD CONTENT -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <!-- Page Header -->
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark font-playfair mb-0">Bakery Operations Dashboard</h1>
              <small class="text-muted">Real-time statistics from MongoDB database</small>
            </div>
            <div class="btn-toolbar mb-2 mb-md-0 gap-2">
              <a routerLink="/admin/products" class="btn btn-sm btn-bakery-orange rounded-pill">
                <i class="bi bi-plus-circle me-1"></i> Add Product
              </a>
              <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="loadDashboard()">
                <i class="bi bi-arrow-clockwise me-1"></i> Refresh Data
              </button>
            </div>
          </div>

          <!-- Loading Spinner -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="text-muted mt-2">Computing dashboard statistics...</p>
          </div>

          <div *ngIf="!loading">
            <!-- 4 STATS CARDS -->
            <div class="row g-4 mb-4">
              <!-- Total Products -->
              <div class="col-sm-6 col-xl-3">
                <div class="card stat-card shadow-sm border-0 border-start border-4 border-primary h-100">
                  <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-primary bg-opacity-10 text-primary me-3">
                      <i class="bi bi-box-seam fs-3"></i>
                    </div>
                    <div>
                      <h6 class="text-muted text-uppercase mb-1 small fw-bold">Total Products</h6>
                      <h2 class="fw-bold mb-0">{{ stats?.totalProducts || 0 }}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Orders -->
              <div class="col-sm-6 col-xl-3">
                <div class="card stat-card shadow-sm border-0 border-start border-4 border-success h-100">
                  <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-success bg-opacity-10 text-success me-3">
                      <i class="bi bi-receipt fs-3"></i>
                    </div>
                    <div>
                      <h6 class="text-muted text-uppercase mb-1 small fw-bold">Total Orders</h6>
                      <h2 class="fw-bold mb-0">{{ stats?.totalOrders || 0 }}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Customers -->
              <div class="col-sm-6 col-xl-3">
                <div class="card stat-card shadow-sm border-0 border-start border-4 border-info h-100">
                  <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-info bg-opacity-10 text-info me-3">
                      <i class="bi bi-people fs-3"></i>
                    </div>
                    <div>
                      <h6 class="text-muted text-uppercase mb-1 small fw-bold">Total Customers</h6>
                      <h2 class="fw-bold mb-0">{{ stats?.totalCustomers || 0 }}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Low Stock Alert -->
              <div class="col-sm-6 col-xl-3">
                <div class="card stat-card shadow-sm border-0 border-start border-4 border-danger h-100">
                  <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-danger bg-opacity-10 text-danger me-3">
                      <i class="bi bi-exclamation-triangle fs-3"></i>
                    </div>
                    <div>
                      <h6 class="text-muted text-uppercase mb-1 small fw-bold">Low Stock (&le;5)</h6>
                      <h2 class="fw-bold mb-0 text-danger">{{ stats?.lowStockProductsCount || 0 }}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECOND ROW: REVENUE & ORDER STATUS CARDS -->
            <div class="row g-4 mb-4">
              <div class="col-md-4">
                <div class="card border-0 shadow-sm p-3 bg-white h-100">
                  <h6 class="text-muted text-uppercase small fw-bold">Total Sales Revenue</h6>
                  <h3 class="fw-bold text-success font-monospace mb-2">₹{{ stats?.totalRevenue || 0 }}</h3>
                  <small class="text-muted">Calculated from confirmed and fulfilled customer orders</small>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card border-0 shadow-sm p-3 bg-white h-100">
                  <h6 class="text-muted text-uppercase small fw-bold">Pending Fulfillment</h6>
                  <h3 class="fw-bold text-warning font-monospace mb-2">{{ stats?.pendingOrdersCount || 0 }} Orders</h3>
                  <small class="text-muted">Orders awaiting kitchen confirmation</small>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card border-0 shadow-sm p-3 bg-white h-100">
                  <h6 class="text-muted text-uppercase small fw-bold">Successfully Delivered</h6>
                  <h3 class="fw-bold text-primary font-monospace mb-2">{{ stats?.deliveredOrdersCount || 0 }} Orders</h3>
                  <small class="text-muted">Delivered to satisfied sweet lovers</small>
                </div>
              </div>
            </div>

            <!-- TABLES SECTION -->
            <div class="row g-4">
              <!-- Recent Orders Table -->
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-4">
                  <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                    <h5 class="mb-0 fw-bold font-playfair">Recent Customer Orders</h5>
                    <a routerLink="/admin/orders" class="btn btn-sm btn-link text-decoration-none">View All</a>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                      <thead class="table-light small">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th class="text-end">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let order of recentOrders">
                          <td><span class="font-monospace small">#{{ order._id | slice: -6 }}</span></td>
                          <td>
                            <strong>{{ getCustomerName(order.customer) }}</strong>
                          </td>
                          <td>{{ order.items.length }} item(s)</td>
                          <td class="fw-bold">₹{{ order.totalAmount }}</td>
                          <td>
                            <span class="badge rounded-pill px-2 py-1" [ngClass]="getStatusBadge(order.orderStatus)">
                              {{ order.orderStatus }}
                            </span>
                          </td>
                          <td class="text-end">
                            <a routerLink="/admin/orders" class="btn btn-sm btn-outline-secondary">
                              <i class="bi bi-pencil"></i>
                            </a>
                          </td>
                        </tr>
                        <tr *ngIf="recentOrders.length === 0">
                          <td colspan="6" class="text-center text-muted py-3">No orders placed yet.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Low Stock Inventory Alerts -->
              <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4">
                  <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold font-playfair text-danger">
                      <i class="bi bi-exclamation-octagon-fill me-1"></i> Low Stock Alerts
                    </h5>
                    <span class="badge bg-danger rounded-pill">{{ lowStockProducts.length }}</span>
                  </div>
                  <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                      <li *ngFor="let prod of lowStockProducts" class="list-group-item d-flex justify-content-between align-items-center py-3">
                        <div class="d-flex align-items-center">
                          <img
                            [src]="prod.imageUrl"
                            [alt]="prod.name"
                            class="rounded me-2"
                            style="width: 40px; height: 40px; object-fit: cover;"
                          />
                          <div>
                            <h6 class="mb-0 fw-semibold text-truncate" style="max-width: 140px;">{{ prod.name }}</h6>
                            <small class="text-muted">₹{{ prod.price }}</small>
                          </div>
                        </div>
                        <span class="badge bg-danger-subtle text-danger border border-danger fw-bold rounded-pill px-2 py-1">
                          Only {{ prod.stock }} left
                        </span>
                      </li>
                      <li *ngIf="lowStockProducts.length === 0" class="list-group-item text-center text-muted py-4">
                        <i class="bi bi-check2-circle text-success fs-3 d-block mb-1"></i>
                        All bakery items are well stocked!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      border-radius: 12px;
      transition: transform 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-3px);
    }
    .stat-icon {
      width: 55px;
      height: 55px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);
  orderService = inject(OrderService);

  stats: DashboardStats | null = null;
  lowStockProducts: Product[] = [];
  recentOrders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        if (res.stats) {
          this.stats = res.stats;
          this.lowStockProducts = res.lowStockProducts || [];
          this.recentOrders = res.recentOrders || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCustomerName(customer: any): string {
    if (!customer) return 'Guest';
    if (typeof customer === 'object' && customer.name) return customer.name;
    return 'Customer';
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
