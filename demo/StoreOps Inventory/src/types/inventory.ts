export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  supplierId: string;
  supplierName: string;
  stock: number;
  unit: 'pcs' | 'boxes' | 'packs' | 'rolls' | 'bottles';
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  status: 'inStock' | 'lowStock' | 'outOfStock' | 'discontinued';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  city: string;
  status: 'active' | 'preferred' | 'paused';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'stockIn' | 'stockOut' | 'adjustment' | 'return';
  quantity: number;
  signedQuantity: number;
  beforeStock: number;
  afterStock: number;
  unit: string;
  reason: string;
  note?: string;
  relatedOrderId?: string;
  createdAt: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  unitCost: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: 'draft' | 'confirmed' | 'fulfilled' | 'cancelled';
  items: SalesOrderItem[];
  subtotal: number;
  estimatedCost: number;
  estimatedProfit: number;
  stockApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ActivityItem {
  id: string;
  type: 'product' | 'inventory' | 'order' | 'supplier' | 'system';
  message: string;
  timestamp: string;
  entityId?: string;
}

export interface AppSettings {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  theme: 'light' | 'dark';
  lastResetAt?: string;
}
