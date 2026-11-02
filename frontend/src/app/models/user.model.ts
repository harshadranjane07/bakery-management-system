export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
