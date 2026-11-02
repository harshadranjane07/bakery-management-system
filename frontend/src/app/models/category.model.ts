export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface CategoryResponse {
  success: boolean;
  count?: number;
  categories?: Category[];
  category?: Category;
  message?: string;
}
