import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InventoryState } from './types';
import { deepCloneInitialData } from '../data/initialData';
import { generateId } from '../utils/ids';
import { deriveProductStatus } from '../utils/stock';

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      ...deepCloneInitialData(),
      settings: {
        language: 'en',
        direction: 'ltr',
        theme: 'light',
        lastResetAt: new Date().toISOString()
      },

      addProduct: (product) => set((state) => {
        const newProduct = { ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        return {
          products: [newProduct, ...state.products],
          activity: [{
            id: generateId(),
            type: 'product',
            message: `New product added: ${product.name}`,
            timestamp: new Date().toISOString(),
            entityId: product.id
          }, ...state.activity]
        };
      }),

      updateProduct: (id, data) => set((state) => {
        return {
          products: state.products.map(p => {
            if (p.id === id) {
              const updatedStock = data.stock ?? p.stock;
              const reorder = data.reorderLevel ?? p.reorderLevel;
              const newStatus = data.status ?? deriveProductStatus(updatedStock, reorder, p.status);
              return { ...p, ...data, status: newStatus, updatedAt: new Date().toISOString() };
            }
            return p;
          }),
          activity: [{
            id: generateId(),
            type: 'product',
            message: `Product updated: ${state.products.find(x => x.id === id)?.name || id}`,
            timestamp: new Date().toISOString(),
            entityId: id
          }, ...state.activity]
        };
      }),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id),
        activity: [{
          id: generateId(),
          type: 'product',
          message: `Product deleted`,
          timestamp: new Date().toISOString()
        }, ...state.activity]
      })),

      addSupplier: (supplier) => set((state) => ({
        suppliers: [{ ...supplier, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state.suppliers],
        activity: [{
          id: generateId(),
          type: 'supplier',
          message: `Supplier added: ${supplier.name}`,
          timestamp: new Date().toISOString(),
          entityId: supplier.id
        }, ...state.activity]
      })),

      updateSupplier: (id, data) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s),
        activity: [{
          id: generateId(),
          type: 'supplier',
          message: `Supplier updated: ${state.suppliers.find(x => x.id === id)?.name || id}`,
          timestamp: new Date().toISOString(),
          entityId: id
        }, ...state.activity]
      })),

      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(s => s.id !== id),
        activity: [{
          id: generateId(),
          type: 'supplier',
          message: `Supplier deleted`,
          timestamp: new Date().toISOString()
        }, ...state.activity]
      })),

      applyInventoryAdjustment: (movementData) => set((state) => {
        let afterStock = 0;
        let beforeStock = 0;
        const products = state.products.map(p => {
          if (p.id === movementData.productId) {
            beforeStock = p.stock;
            afterStock = beforeStock + movementData.signedQuantity;
            const status = deriveProductStatus(afterStock, p.reorderLevel, p.status);
            return { ...p, stock: afterStock, status, updatedAt: new Date().toISOString() };
          }
          return p;
        });

        const newMovement = {
          ...movementData,
          id: generateId(),
          beforeStock,
          afterStock,
          createdAt: new Date().toISOString()
        };

        return {
          products,
          inventoryMovements: [newMovement, ...state.inventoryMovements],
          activity: [{
            id: generateId(),
            type: 'inventory',
            message: `Stock ${movementData.signedQuantity > 0 ? '+' : ''}${movementData.signedQuantity} for ${movementData.productName}`,
            timestamp: new Date().toISOString(),
            entityId: movementData.productId
          }, ...state.activity]
        };
      }),

      createSalesOrder: (order) => set((state) => {
        let products = state.products;
        let movements = state.inventoryMovements;
        let stockApplied = false;

        if (order.status === 'confirmed' || order.status === 'fulfilled') {
          stockApplied = true;
          order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              const beforeStock = product.stock;
              const afterStock = product.stock - item.quantity;
              
              products = products.map(p => 
                p.id === product.id 
                  ? { ...p, stock: afterStock, status: deriveProductStatus(afterStock, p.reorderLevel, p.status), updatedAt: new Date().toISOString() } 
                  : p
              );

              movements = [{
                id: generateId(),
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                type: 'stockOut',
                quantity: item.quantity,
                signedQuantity: -item.quantity,
                beforeStock,
                afterStock,
                unit: product.unit,
                reason: `Sales Order ${order.orderNumber}`,
                relatedOrderId: order.id,
                createdAt: new Date().toISOString()
              }, ...movements];
            }
          });
        }

        const newOrder = { ...order, stockApplied, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

        return {
          salesOrders: [newOrder, ...state.salesOrders],
          products,
          inventoryMovements: movements,
          activity: [{
            id: generateId(),
            type: 'order',
            message: `Sales Order ${order.orderNumber} created`,
            timestamp: new Date().toISOString(),
            entityId: order.id
          }, ...state.activity]
        };
      }),

      updateSalesOrderStatus: (id, status) => set((state) => {
        const order = state.salesOrders.find(o => o.id === id);
        if (!order || order.status === status) return state;

        let products = state.products;
        let movements = state.inventoryMovements;
        let stockApplied = order.stockApplied;
        let typeStr = '';

        if (status === 'cancelled' && stockApplied) {
          // Revert stock
          order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              const beforeStock = product.stock;
              const afterStock = product.stock + item.quantity;
              
              products = products.map(p => 
                p.id === product.id 
                  ? { ...p, stock: afterStock, status: deriveProductStatus(afterStock, p.reorderLevel, p.status), updatedAt: new Date().toISOString() } 
                  : p
              );

              movements = [{
                id: generateId(),
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                type: 'stockIn', // returning to stock
                quantity: item.quantity,
                signedQuantity: item.quantity,
                beforeStock,
                afterStock,
                unit: product.unit,
                reason: `Sales Order ${order.orderNumber} Cancelled`,
                relatedOrderId: order.id,
                createdAt: new Date().toISOString()
              }, ...movements];
            }
          });
          stockApplied = false;
          typeStr = 'Cancelled';
        } else if ((status === 'confirmed' || status === 'fulfilled') && !stockApplied) {
          // Deduct stock
          order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              const beforeStock = product.stock;
              const afterStock = product.stock - item.quantity;
              
              products = products.map(p => 
                p.id === product.id 
                  ? { ...p, stock: afterStock, status: deriveProductStatus(afterStock, p.reorderLevel, p.status), updatedAt: new Date().toISOString() } 
                  : p
              );

              movements = [{
                id: generateId(),
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                type: 'stockOut',
                quantity: item.quantity,
                signedQuantity: -item.quantity,
                beforeStock,
                afterStock,
                unit: product.unit,
                reason: `Sales Order ${order.orderNumber}`,
                relatedOrderId: order.id,
                createdAt: new Date().toISOString()
              }, ...movements];
            }
          });
          stockApplied = true;
          typeStr = 'Confirmed';
        }

        return {
          salesOrders: state.salesOrders.map(o => o.id === id ? { ...o, status, stockApplied, updatedAt: new Date().toISOString() } : o),
          products,
          inventoryMovements: movements,
          activity: [{
            id: generateId(),
            type: 'order',
            message: `Order ${order.orderNumber} status changed to ${status}`,
            timestamp: new Date().toISOString(),
            entityId: order.id
          }, ...state.activity]
        };
      }),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),

      resetToInitialData: () => set((state) => ({
        ...deepCloneInitialData(),
        settings: { ...state.settings, lastResetAt: new Date().toISOString() },
        activity: [{
          id: generateId(),
          type: 'system',
          message: 'System reset to demo data',
          timestamp: new Date().toISOString(),
        }]
      }))
    }),
    {
      name: 'storeops-inventory-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
