import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Order, OrderItem, Coupon } from '../types';
import { mockProducts } from '../mock/products';
import { mockOrders, mockCoupons } from '../mock/orders';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  orders: Order[];
  placeOrder: (orderInfo: Omit<Order, 'id' | 'date' | 'status' | 'items' | 'total'>, discount: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  
  taxSettings: { enabled: boolean; rate: number };
  updateTaxSettings: (settings: { enabled: boolean; rate: number }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.product.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      
      products: mockProducts,
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: `p${Date.now()}` }]
      })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      orders: mockOrders,
      placeOrder: (orderInfo, discount) => set((state) => {
        const items: OrderItem[] = state.cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.discountPercentage ? item.product.price * (1 - item.product.discountPercentage / 100) : item.product.price,
          quantity: item.quantity,
          image: item.product.image
        }));
        
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalAfterDiscount = subtotal * (1 - discount / 100);
        const tax = state.taxSettings.enabled ? subtotalAfterDiscount * (state.taxSettings.rate / 100) : 0;
        const total = subtotalAfterDiscount + tax;
        
        const newOrder: Order = {
          ...orderInfo,
          id: `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          date: new Date().toISOString(),
          status: 'Pending',
          items,
          total
        };
        
        return {
          orders: [newOrder, ...state.orders],
          cart: [] // clear cart on order
        };
      }),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
      
      coupons: mockCoupons,
      addCoupon: (coupon) => set((state) => ({
        coupons: [...state.coupons, coupon]
      })),
      updateCoupon: (code, updates) => set((state) => ({
        coupons: state.coupons.map(c => c.code === code ? { ...c, ...updates } : c)
      })),
      deleteCoupon: (code) => set((state) => ({
        coupons: state.coupons.filter(c => c.code !== code)
      })),

      taxSettings: { enabled: true, rate: 8 },
      updateTaxSettings: (settings) => set({ taxSettings: settings }),
    }),
    {
      name: 'shopnest-storage',
      storage: createJSONStorage(() => sessionStorage), // User requested sessionStorage
    }
  )
);
