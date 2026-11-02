import { User } from './user.model';

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  _id: string;
  customer: User | string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'Cash on Delivery' | 'UPI / Online Payment';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
  orderNotes?: string;
  createdAt: string;
}

export interface OrderResponse {
  success: boolean;
  count?: number;
  orders?: Order[];
  order?: Order;
  message?: string;
}
