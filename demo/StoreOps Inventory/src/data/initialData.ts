import { Product, Supplier, Category, SalesOrder, InventoryMovement, ActivityItem } from '../types/inventory';
import { mockCategories, mockSuppliers } from './mockCategoriesAndSuppliers';
import { mockProducts } from './mockProducts';
import { mockSalesOrders, mockInventoryMovements, mockActivity } from './mockOrdersAndActivity';

export const initialData = {
  products: mockProducts,
  suppliers: mockSuppliers,
  categories: mockCategories,
  salesOrders: mockSalesOrders,
  inventoryMovements: mockInventoryMovements,
  activity: mockActivity,
};

export function deepCloneInitialData() {
  return JSON.parse(JSON.stringify(initialData));
}
