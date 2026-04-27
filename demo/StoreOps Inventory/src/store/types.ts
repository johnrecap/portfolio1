import { 
  Product, Supplier, Category, SalesOrder, InventoryMovement, ActivityItem, AppSettings 
} from '../types/inventory';

export interface InventoryState {
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  salesOrders: SalesOrder[];
  inventoryMovements: InventoryMovement[];
  activity: ActivityItem[];
  settings: AppSettings;
  
  // Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  applyInventoryAdjustment: (movement: Omit<InventoryMovement, 'id' | 'createdAt' | 'beforeStock' | 'afterStock'>) => void;
  
  createSalesOrder: (order: SalesOrder) => void;
  updateSalesOrderStatus: (id: string, status: SalesOrder['status']) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetToInitialData: () => void;
}
