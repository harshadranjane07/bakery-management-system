import { Product } from './product.model';
import { Order } from './order.model';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProductsCount: number;
  totalRevenue: number;
  pendingOrdersCount: number;
  processingOrdersCount: number;
  deliveredOrdersCount: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  lowStockProducts: Product[];
  recentOrders: Order[];
  message?: string;
}
