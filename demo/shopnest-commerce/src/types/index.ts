export type Category = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  discountPercentage?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  active: boolean;
}
