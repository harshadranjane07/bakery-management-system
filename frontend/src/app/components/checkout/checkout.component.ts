import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <!-- SUCCESS CONFIRMATION VIEW -->
      <div *ngIf="placedOrder" class="row justify-content-center">
        <div class="col-lg-8">
          <div class="bg-white rounded-4 shadow-sm border p-5 text-center">
            <div class="success-checkmark mx-auto mb-4">
              <i class="bi bi-check-lg display-4 text-white"></i>
            </div>
            <span class="badge bg-success rounded-pill px-3 py-2 text-uppercase mb-2">Order Confirmed</span>
            <h2 class="display-6 fw-bold mb-2">Thank You For Your Order!</h2>
            <p class="text-muted lead fs-6 mb-4">
              Your order has been received and sent to our master baker. We are preparing your fresh treats right now!
            </p>

            <!-- Order Summary Ticket -->
            <div class="order-ticket p-4 rounded-3 text-start mb-4 mx-auto" style="max-width: 520px; background-color: #FAF3EB; border: 1px dashed var(--light-brown);">
              <div class="d-flex justify-content-between pb-2 mb-2 border-bottom">
                <span class="text-muted">Order ID:</span>
                <span class="fw-bold font-monospace">#{{ placedOrder._id }}</span>
              </div>
              <div class="d-flex justify-content-between pb-2 mb-2 border-bottom">
                <span class="text-muted">Payment Method:</span>
                <span class="fw-semibold">{{ placedOrder.paymentMethod }}</span>
              </div>
              <div class="d-flex justify-content-between pb-2 mb-2 border-bottom">
                <span class="text-muted">Delivery To:</span>
                <span class="fw-semibold text-end">
                  {{ placedOrder.shippingAddress.fullName }}<br />
                  <small class="text-muted">{{ placedOrder.shippingAddress.address }}, {{ placedOrder.shippingAddress.city }} - {{ placedOrder.shippingAddress.pincode }}</small>
                </span>
              </div>
              <div class="d-flex justify-content-between pt-1">
                <span class="fs-5 fw-bold">Total Paid/Payable:</span>
                <span class="fs-5 fw-bold text-dark">₹{{ placedOrder.totalAmount }}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap justify-content-center gap-3">
              <a routerLink="/my-orders" class="btn btn-bakery-primary rounded-pill px-4">
                <i class="bi bi-bag-check me-2"></i> Track My Orders
              </a>
              <a routerLink="/products" class="btn btn-outline-secondary rounded-pill px-4">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- CHECKOUT FORM VIEW -->
      <div *ngIf="!placedOrder">
        <div class="mb-4">
          <h2 class="display-6 fw-bold mb-1">Checkout & Delivery Details</h2>
          <p class="text-muted">Enter delivery address and choose your payment method</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
        </div>

        <div class="row g-4">
          <!-- Left: Address & Payment Form -->
          <div class="col-lg-7">
            <div class="bg-white rounded-4 shadow-sm border p-4 p-md-5">
              <h4 class="fw-bold mb-3 font-playfair">1. Delivery Address</h4>
              
              <form (ngSubmit)="placeOrder()" #checkoutForm="ngForm">
                <div class="row g-3 mb-4">
                  <!-- Full Name -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Recipient Full Name <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      class="form-control"
                      placeholder="e.g. Rahul Sharma"
                      [(ngModel)]="shippingAddress.fullName"
                      required
                    />
                  </div>

                  <!-- Contact Phone -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Mobile Number <span class="text-danger">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      class="form-control"
                      placeholder="10-digit phone number"
                      [(ngModel)]="shippingAddress.phone"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <!-- Street Address -->
                  <div class="col-12">
                    <label class="form-label fw-semibold">Street Address / House No. <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      name="address"
                      class="form-control"
                      placeholder="Flat/House number, Apartment name, Street"
                      [(ngModel)]="shippingAddress.address"
                      required
                    />
                  </div>

                  <!-- City -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">City <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      name="city"
                      class="form-control"
                      placeholder="e.g. Pune"
                      [(ngModel)]="shippingAddress.city"
                      required
                    />
                  </div>

                  <!-- Pincode -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">PIN Code <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      name="pincode"
                      class="form-control"
                      placeholder="e.g. 411001"
                      [(ngModel)]="shippingAddress.pincode"
                      required
                      pattern="[0-9]{6}"
                    />
                  </div>

                  <!-- Order Notes -->
                  <div class="col-12">
                    <label class="form-label fw-semibold">Special Bakery Notes / Delivery Instructions</label>
                    <textarea
                      name="orderNotes"
                      class="form-control"
                      rows="2"
                      placeholder="e.g. Please write 'Happy Birthday Amit' on cake, eggless requirement, or landmark"
                      [(ngModel)]="orderNotes"
                    ></textarea>
                  </div>
                </div>

                <h4 class="fw-bold mb-3 pt-3 border-top font-playfair">2. Payment Method</h4>
                <div class="mb-4">
                  <div class="form-check p-3 border rounded-3 mb-2" [class.border-warning]="paymentMethod === 'Cash on Delivery'">
                    <input
                      class="form-check-input ms-1 me-2"
                      type="radio"
                      name="paymentRadio"
                      id="cod"
                      value="Cash on Delivery"
                      [(ngModel)]="paymentMethod"
                    />
                    <label class="form-check-label fw-semibold" for="cod">
                      <i class="bi bi-cash-stack text-success me-2 fs-5"></i> Cash on Delivery (Pay at Doorstep)
                    </label>
                    <div class="text-muted small ms-4">Pay with cash or scan delivery partner's UPI QR code upon arrival</div>
                  </div>

                  <div class="form-check p-3 border rounded-3" [class.border-warning]="paymentMethod === 'UPI / Online Payment'">
                    <input
                      class="form-check-input ms-1 me-2"
                      type="radio"
                      name="paymentRadio"
                      id="online"
                      value="UPI / Online Payment"
                      [(ngModel)]="paymentMethod"
                    />
                    <label class="form-check-label fw-semibold" for="online">
                      <i class="bi bi-qr-code-scan text-primary me-2 fs-5"></i> UPI / Online Payment (Demo)
                    </label>
                    <div class="text-muted small ms-4">Instant payment demo for Google Pay, PhonePe, Paytm, or Cards</div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-lg btn-bakery-orange w-100 rounded-pill fw-bold shadow-sm"
                  [disabled]="checkoutForm.invalid || submitting || cartItems.length === 0"
                >
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i *ngIf="!submitting" class="bi bi-check2-circle me-1"></i> Confirm & Place Order (₹{{ grandTotal }})
                </button>
              </form>
            </div>
          </div>

          <!-- Right: Order Summary Preview -->
          <div class="col-lg-5">
            <div class="bg-white rounded-4 shadow-sm border p-4 sticky-top" style="top: 90px;">
              <h4 class="fw-bold mb-3 font-playfair">Items in Order ({{ cartItems.length }})</h4>

              <div class="order-items-scroll mb-3" style="max-height: 280px; overflow-y: auto;">
                <div *ngFor="let item of cartItems" class="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    [src]="item.product.imageUrl"
                    [alt]="item.product.name"
                    class="rounded-3 me-3"
                    style="width: 50px; height: 50px; object-fit: cover;"
                  />
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-semibold text-truncate" style="max-width: 170px;">{{ item.product.name }}</h6>
                    <small class="text-muted">{{ item.quantity }} &times; ₹{{ item.product.price }}</small>
                  </div>
                  <span class="fw-bold">₹{{ item.product.price * item.quantity }}</span>
                </div>
              </div>

              <!-- Calculation breakdown -->
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Items Subtotal:</span>
                <span class="fw-semibold">₹{{ subtotal }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">5% GST:</span>
                <span class="fw-semibold">₹{{ tax }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Delivery Charges:</span>
                <span [ngClass]="deliveryCharges === 0 ? 'text-success fw-bold' : 'fw-semibold'">
                  {{ deliveryCharges === 0 ? 'FREE' : '₹' + deliveryCharges }}
                </span>
              </div>

              <hr />

              <div class="d-flex justify-content-between align-items-baseline mb-2">
                <span class="fs-5 fw-bold">Total Amount:</span>
                <span class="fs-4 fw-bold" style="color: var(--primary-brown);">₹{{ grandTotal }}</span>
              </div>
              <small class="text-muted d-block text-center mt-3">
                <i class="bi bi-clock-history me-1"></i> Estimated delivery time: 35-45 minutes
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-checkmark {
      width: 80px;
      height: 80px;
      background-color: #28a745;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .order-items-scroll::-webkit-scrollbar {
      width: 5px;
    }
    .order-items-scroll::-webkit-scrollbar-thumb {
      background-color: #d1b8a5;
      border-radius: 10px;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItems: CartItem[] = [];
  shippingAddress = {
    fullName: '',
    phone: '',
    address: '',
    city: 'Pune',
    pincode: '411001'
  };
  paymentMethod: 'Cash on Delivery' | 'UPI / Online Payment' = 'Cash on Delivery';
  orderNotes = '';
  submitting = false;
  errorMessage = '';
  placedOrder: Order | null = null;

  ngOnInit(): void {
    this.cartItems = this.cartService.items;
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // Pre-fill user profile info if logged in
    const user = this.authService.currentUserValue;
    if (user) {
      this.shippingAddress.fullName = user.name || '';
      this.shippingAddress.phone = user.phone || '';
      if (user.address) {
        if (user.address.street) this.shippingAddress.address = user.address.street;
        if (user.address.city) this.shippingAddress.city = user.address.city;
        if (user.address.pincode) this.shippingAddress.pincode = user.address.pincode;
      }
    }
  }

  get subtotal(): number {
    return this.cartService.getTotalAmount();
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.05);
  }

  get deliveryCharges(): number {
    return this.subtotal >= 499 ? 0 : 50;
  }

  get grandTotal(): number {
    return this.subtotal + this.tax + this.deliveryCharges;
  }

  placeOrder(): void {
    this.submitting = true;
    this.errorMessage = '';

    const payload = {
      items: this.cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      orderNotes: this.orderNotes
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.order) {
          this.placedOrder = res.order;
          this.cartService.clearCart();
        }
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Could not place order. Please try again.';
      }
    });
  }
}
