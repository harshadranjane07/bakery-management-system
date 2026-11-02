import { Category } from './category.model';

export interface Product {
  _id: string;
  name: string;
  category: Category | string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  unit?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface ProductResponse {
  success: boolean;
  count?: number;
  products?: Product[];
  product?: Product;
  message?: string;
}
