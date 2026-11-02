import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(filters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sort?: string;
  }): Observable<ProductResponse> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.featured !== undefined) params = params.set('featured', String(filters.featured));
    if (filters?.sort) params = params.set('sort', filters.sort);

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getFeaturedProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/featured`);
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: FormData | any): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, productData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateProduct(id: string, productData: FormData | any): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, productData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  uploadImage(file: File): Observable<{ success: boolean; imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ success: boolean; imageUrl: string }>(`${this.apiUrl}/upload`, formData, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
