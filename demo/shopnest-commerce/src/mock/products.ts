import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 45,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'p2',
    name: 'Minimalist Mechanical Keyboard',
    description: 'Compact 75% mechanical keyboard with tactile switches, RGB backlighting, and premium PBT keycaps.',
    price: 129.50,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    stock: 20,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'p3',
    name: 'Organic Cotton Classic Tee',
    description: 'Ultra-soft, breathable, and sustainably sourced organic cotton t-shirt for everyday wear.',
    price: 24.00,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    stock: 150,
    rating: 4.5,
    reviews: 230
  },
  {
    id: 'p4',
    name: 'Ceramic Pour-Over Coffee Maker',
    description: 'Artisan-crafted ceramic pour-over cone for the perfect, clean cup of coffee. Includes 100 paper filters.',
    price: 45.00,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80',
    stock: 35,
    rating: 4.7,
    reviews: 56
  },
  {
    id: 'p5',
    name: 'Leather Messenger Bag',
    description: 'Handcrafted full-grain leather bag with padded laptop sleeve and multiple organizational pockets.',
    price: 189.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    stock: 12,
    rating: 4.6,
    reviews: 42
  },
  {
    id: 'p6',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, built-in GPS, and sleep analysis.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    stock: 60,
    rating: 4.4,
    reviews: 315
  }
];
