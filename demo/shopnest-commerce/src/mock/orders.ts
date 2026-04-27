import { Order, Coupon } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-8A9B',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    status: 'Delivered',
    shippingAddress: '123 Meadow Lane, Springfield, IL',
    total: 323.99,
    items: [
      {
        productId: 'p1',
        name: 'Wireless Noise-Canceling Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      },
      {
        productId: 'p3',
        name: 'Organic Cotton Classic Tee',
        price: 24.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
      }
    ]
  },
  {
    id: 'ORD-3C4D',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    customerName: 'Michael Smith',
    customerEmail: 'michael.s@example.com',
    status: 'Processing',
    shippingAddress: '456 Oak Avenue, Austin, TX',
    total: 129.50,
    items: [
      {
        productId: 'p2',
        name: 'Minimalist Mechanical Keyboard',
        price: 129.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
      }
    ]
  }
];

export const mockCoupons: Coupon[] = [
  { code: 'WELCOME10', discountPercentage: 10, active: true },
  { code: 'SUMMER20', discountPercentage: 20, active: true },
  { code: 'EXPIRED50', discountPercentage: 50, active: false }
];
