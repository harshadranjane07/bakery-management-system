import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="display-6 fw-bold mb-1">My Orders & Order History</h2>
          <p class="text-muted mb-0">Track all your delicious bakery orders and delivery status</p>
        </div>
        <a routerLink="/products" class="btn btn-outline-secondary rounded-pill">
          <i class="bi bi-bag-plus me-1"></i> Order More
        </a>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="text-muted mt-2">Loading your orders...</p>
      </div>

      <!-- No Orders State -->
      <div *ngIf="!loading && orders.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
        <i class="bi bi-receipt text-muted display-1"></i>
        <h4 class="mt-3 fw-bold">No Orders Placed Yet</h4>
        <p class="text-muted mb-4">You have not ordered any freshly baked items yet. Treat yourself today!</p>
        <a routerLink="/products" class="btn btn-bakery-orange rounded-pill px-4">
          Browse Bakery Menu
        </a>
      </div>

      <!-- Orders List -->
      <div *ngIf="!loading && orders.length > 0" class="d-flex flex-column gap-4">
        <div *ngFor="let order of orders" class="bg-white rounded-4 shadow-sm border p-4">
          <!-- Order Card Header -->
          <div class="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <div>
              <span class="text-muted small">ORDER ID:</span>
              <span class="font-monospace fw-bold ms-1">#{{ order._id }}</span>
              <span class="text-muted small ms-3">
                <i class="bi bi-calendar3 me-1"></i> {{ order.createdAt | date:'medium' }}
              </span>
            </div>

            <div>
              <span
                class="badge rounded-pill px-3 py-2 text-uppercase fs-6"
                [ngClass]="getStatusBadgeClass(order.orderStatus)"
              >
                <i class="bi" [ngClass]="getStatusIcon(order.orderStatus)"></i>
                {{ order.orderStatus }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="row g-3">
            <div class="col-lg-8">
              <h6 class="fw-bold mb-3 text-muted text-uppercase small" style="letter-spacing: 1px;">Items Ordered</h6>
              <div class="d-flex flex-column gap-2">
                <div *ngFor="let item of order.items" class="d-flex align-items-center p-2 rounded-3 bg-light">
                  <img
                    [src]="item.imageUrl || defaultImg"
                    [alt]="item.name"
                    class="rounded-2 me-3"
                    style="width: 50px; height: 50px; object-fit: cover;"
                  />
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-semibold">{{ item.name }}</h6>
                    <small class="text-muted">₹{{ item.price }} &times; {{ item.quantity }}</small>
                  </div>
                  <span class="fw-bold text-dark me-2">₹{{ item.price * item.quantity }}</span>
                </div>
              </div>

              <div *ngIf="order.orderNotes" class="mt-3 small text-muted fst-italic">
                <i class="bi bi-chat-quote me-1"></i> Special instructions: "{{ order.orderNotes }}"
              </div>
            </div>

            <!-- Delivery & Payment Info -->
            <div class="col-lg-4 border-start-lg ps-lg-4">
              <h6 class="fw-bold mb-3 text-muted text-uppercase small" style="letter-spacing: 1px;">Delivery Details</h6>
              <div class="small mb-3">
                <strong class="d-block">{{ order.shippingAddress.fullName }}</strong>
                <span class="text-muted">
                  {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }} - {{ order.shippingAddress.pincode }}
                </span>
                <span class="d-block text-muted mt-1"><i class="bi bi-telephone me-1"></i> {{ order.shippingAddress.phone }}</span>
              </div>

              <div class="p-3 rounded-3" style="background-color: #FAF3EB;">
                <div class="d-flex justify-content-between mb-1 small">
                  <span class="text-muted">Payment:</span>
                  <span class="fw-semibold">{{ order.paymentMethod }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-baseline">
                  <span class="fw-bold">Total Amount:</span>
                  <span class="fs-5 fw-bold" style="color: var(--primary-brown);">₹{{ order.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @media (min-width: 992px) {
      .border-start-lg {
        border-left: 1px solid #EADBC8;
      }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;
  defaultImg = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        if (res.orders) {
          this.orders = res.orders;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Confirmed':
        return 'bg-info text-dark';
      case 'Processing':
        return 'bg-primary text-white';
      case 'Delivered':
        return 'bg-success text-white';
      case 'Cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bi-hourglass-split me-1';
      case 'Confirmed':
        return 'bi-check2-circle me-1';
      case 'Processing':
        return 'bi-gear-wide-connected me-1';
      case 'Delivered':
        return 'bi-truck me-1';
      case 'Cancelled':
        return 'bi-x-circle me-1';
      default:
        return 'bi-info-circle me-1';
    }
  }
}
