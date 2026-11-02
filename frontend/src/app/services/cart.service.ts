import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem('bakery_cart');
    if (saved) {
      try {
        this.cartItemsSubject.next(JSON.parse(saved));
      } catch (e) {
        this.cartItemsSubject.next([]);
      }
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('bakery_cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  public get items(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity = 1): { success: boolean; message: string } {
    if (product.stock <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    const currentItems = [...this.cartItemsSubject.value];
    const index = currentItems.findIndex((item) => item.product._id === product._id);

    if (index > -1) {
      const newQty = currentItems[index].quantity + quantity;
      if (newQty > product.stock) {
        return {
          success: false,
          message: `Cannot add more. Only ${product.stock} units available in stock.`
        };
      }
      currentItems[index].quantity = newQty;
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Cannot add ${quantity} units. Only ${product.stock} available in stock.`
        };
      }
      currentItems.push({ product, quantity });
    }

    this.saveCart(currentItems);
    return { success: true, message: `Added "${product.name}" to your cart!` };
  }

  updateQuantity(productId: string, quantity: number): { success: boolean; message?: string } {
    const currentItems = [...this.cartItemsSubject.value];
    const index = currentItems.findIndex((item) => item.product._id === productId);

    if (index === -1) return { success: false, message: 'Item not in cart' };

    const product = currentItems[index].product;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return { success: true, message: 'Item removed from cart' };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        message: `Maximum available stock is ${product.stock} units.`
      };
    }

    currentItems[index].quantity = quantity;
    this.saveCart(currentItems);
    return { success: true };
  }

  removeFromCart(productId: string): void {
    const updated = this.cartItemsSubject.value.filter((item) => item.product._id !== productId);
    this.saveCart(updated);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
