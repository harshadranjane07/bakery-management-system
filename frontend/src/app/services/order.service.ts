import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderResponse, ShippingAddress } from '../models/order.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/orders`;

  createOrder(orderData: {
    items: { product: string; quantity: number }[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    orderNotes?: string;
  }): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getMyOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/my-orders`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAllOrders(status?: string): Observable<OrderResponse> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get<OrderResponse>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getOrderById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateOrderStatus(id: string, status: string): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
