import { InventoryMovement, SalesOrder, ActivityItem } from '../types/inventory';
import { mockProducts } from './mockProducts';

// Generate recent date dynamically
const now = new Date();
function getRecentDate(daysAgo: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'ord_1',
    orderNumber: 'SO-1025',
    customerName: 'Cairo Retail Network',
    orderDate: getRecentDate(1),
    status: 'confirmed',
    items: [
      { id: 'item_1', productId: 'prod_1', productName: 'Wireless Mouse', sku: 'WM-001', quantity: 5, unit: 'pcs', unitPrice: 350, unitCost: 150, lineTotal: 1750 },
      { id: 'item_2', productId: 'prod_2', productName: 'USB-C Charger 30W', sku: 'UC-030', quantity: 10, unit: 'pcs', unitPrice: 450, unitCost: 200, lineTotal: 4500 }
    ],
    subtotal: 6250,
    estimatedCost: 2750,
    estimatedProfit: 3500,
    stockApplied: true,
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(1)
  },
  {
    id: 'ord_2',
    orderNumber: 'SO-1026',
    customerName: 'Alexandria Office Solutions',
    orderDate: getRecentDate(2),
    status: 'fulfilled',
    items: [
      { id: 'item_3', productId: 'prod_3', productName: 'A4 Copy Paper Box', sku: 'A4-BOX', quantity: 20, unit: 'boxes', unitPrice: 120, unitCost: 80, lineTotal: 2400 }
    ],
    subtotal: 2400,
    estimatedCost: 1600,
    estimatedProfit: 800,
    stockApplied: true,
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(1)
  },
  {
    id: 'ord_3',
    orderNumber: 'SO-1027',
    customerName: 'TechMart Giza',
    orderDate: getRecentDate(3),
    status: 'draft',
    items: [
      { id: 'item_4', productId: 'prod_11', productName: 'Bluetooth Speaker', sku: 'BS-808', quantity: 4, unit: 'pcs', unitPrice: 750, unitCost: 400, lineTotal: 3000 }
    ],
    subtotal: 3000,
    estimatedCost: 1600,
    estimatedProfit: 1400,
    stockApplied: false,
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(3)
  },
  {
    id: 'ord_4',
    orderNumber: 'SO-1028',
    customerName: 'Delta Supermarkets',
    orderDate: getRecentDate(4),
    status: 'fulfilled',
    items: [
      { id: 'item_5', productId: 'prod_13', productName: 'Organic Honey 500g', sku: 'HNY-ORG', quantity: 15, unit: 'bottles', unitPrice: 220, unitCost: 120, lineTotal: 3300 },
      { id: 'item_6', productId: 'prod_17', productName: 'Premium Tea Blend', sku: 'TEA-PRM', quantity: 30, unit: 'packs', unitPrice: 115, unitCost: 65, lineTotal: 3450 }
    ],
    subtotal: 6750,
    estimatedCost: 3750,
    estimatedProfit: 3000,
    stockApplied: true,
    createdAt: getRecentDate(4),
    updatedAt: getRecentDate(3)
  },
  {
    id: 'ord_5',
    orderNumber: 'SO-1029',
    customerName: 'Healthy Habits Store',
    orderDate: getRecentDate(5),
    status: 'cancelled',
    items: [
      { id: 'item_7', productId: 'prod_8', productName: 'Stainless Water Bottle', sku: 'WB-SS500', quantity: 10, unit: 'pcs', unitPrice: 280, unitCost: 150, lineTotal: 2800 }
    ],
    subtotal: 2800,
    estimatedCost: 1500,
    estimatedProfit: 1300,
    stockApplied: false,
    createdAt: getRecentDate(5),
    updatedAt: getRecentDate(4)
  },
  {
    id: 'ord_6',
    orderNumber: 'SO-1030',
    customerName: 'MegaMall Branch 2',
    orderDate: getRecentDate(10),
    status: 'fulfilled',
    items: [
      { id: 'item_8', productId: 'prod_15', productName: 'Dishwashing Liquid 1L', sku: 'DISH-1L', quantity: 50, unit: 'bottles', unitPrice: 55, unitCost: 30, lineTotal: 2750 },
      { id: 'item_9', productId: 'prod_9', productName: 'Hand Soap 500ml', sku: 'SOAP-500', quantity: 40, unit: 'bottles', unitPrice: 45, unitCost: 25, lineTotal: 1800 }
    ],
    subtotal: 4550,
    estimatedCost: 2500,
    estimatedProfit: 2050,
    stockApplied: true,
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(8)
  },
  {
    id: 'ord_7',
    orderNumber: 'SO-1031',
    customerName: 'PackStation Co',
    orderDate: getRecentDate(12),
    status: 'confirmed',
    items: [
      { id: 'item_10', productId: 'prod_12', productName: 'Shipping Labels', sku: 'LBL-500', quantity: 30, unit: 'rolls', unitPrice: 85, unitCost: 45, lineTotal: 2550 },
      { id: 'item_11', productId: 'prod_16', productName: 'Cardboard Box Medium', sku: 'BOX-MED', quantity: 100, unit: 'pcs', unitPrice: 12, unitCost: 5, lineTotal: 1200 }
    ],
    subtotal: 3750,
    estimatedCost: 1850,
    estimatedProfit: 1900,
    stockApplied: true,
    createdAt: getRecentDate(12),
    updatedAt: getRecentDate(12)
  },
  {
    id: 'ord_8',
    orderNumber: 'SO-1032',
    customerName: 'Modern Home Decor',
    orderDate: getRecentDate(14),
    status: 'fulfilled',
    items: [
      { id: 'item_12', productId: 'prod_6', productName: 'LED Desk Lamp', sku: 'LED-DL01', quantity: 8, unit: 'pcs', unitPrice: 450, unitCost: 250, lineTotal: 3600 },
      { id: 'item_13', productId: 'prod_5', productName: 'Ceramic Coffee Mug', sku: 'MUG-WHT', quantity: 15, unit: 'pcs', unitPrice: 90, unitCost: 45, lineTotal: 1350 }
    ],
    subtotal: 4950,
    estimatedCost: 2675,
    estimatedProfit: 2275,
    stockApplied: true,
    createdAt: getRecentDate(14),
    updatedAt: getRecentDate(11)
  },
  {
    id: 'ord_9',
    orderNumber: 'SO-1033',
    customerName: 'Cairo Retail Network',
    orderDate: getRecentDate(16),
    status: 'fulfilled',
    items: [
      { id: 'item_14', productId: 'prod_7', productName: 'Cotton Tote Bag', sku: 'BAG-CTN', quantity: 50, unit: 'pcs', unitPrice: 75, unitCost: 35, lineTotal: 3750 }
    ],
    subtotal: 3750,
    estimatedCost: 1750,
    estimatedProfit: 2000,
    stockApplied: true,
    createdAt: getRecentDate(16),
    updatedAt: getRecentDate(15)
  },
  {
    id: 'ord_10',
    orderNumber: 'SO-1034',
    customerName: 'Beauty Boutique',
    orderDate: getRecentDate(18),
    status: 'fulfilled',
    items: [
      { id: 'item_15', productId: 'prod_14', productName: 'Shampoo 400ml', sku: 'SHMP-400', quantity: 25, unit: 'bottles', unitPrice: 80, unitCost: 40, lineTotal: 2000 }
    ],
    subtotal: 2000,
    estimatedCost: 1000,
    estimatedProfit: 1000,
    stockApplied: true,
    createdAt: getRecentDate(18),
    updatedAt: getRecentDate(16)
  },
  {
    id: 'ord_11',
    orderNumber: 'SO-1035',
    customerName: 'Startup Hub',
    orderDate: getRecentDate(20),
    status: 'cancelled',
    items: [
      { id: 'item_16', productId: 'prod_1', productName: 'Wireless Mouse', sku: 'WM-001', quantity: 15, unit: 'pcs', unitPrice: 350, unitCost: 150, lineTotal: 5250 }
    ],
    subtotal: 5250,
    estimatedCost: 2250,
    estimatedProfit: 3000,
    stockApplied: false,
    createdAt: getRecentDate(20),
    updatedAt: getRecentDate(19)
  },
  {
    id: 'ord_12',
    orderNumber: 'SO-1036',
    customerName: 'TechMart Giza',
    orderDate: getRecentDate(22),
    status: 'fulfilled',
    items: [
      { id: 'item_17', productId: 'prod_2', productName: 'USB-C Charger 30W', sku: 'UC-030', quantity: 20, unit: 'pcs', unitPrice: 450, unitCost: 200, lineTotal: 9000 },
      { id: 'item_18', productId: 'prod_11', productName: 'Bluetooth Speaker', sku: 'BS-808', quantity: 5, unit: 'pcs', unitPrice: 750, unitCost: 400, lineTotal: 3750 }
    ],
    subtotal: 12750,
    estimatedCost: 6000,
    estimatedProfit: 6750,
    stockApplied: true,
    createdAt: getRecentDate(22),
    updatedAt: getRecentDate(20)
  }
];

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: 'mov_1',
    productId: 'prod_2',
    productName: 'USB-C Charger 30W',
    sku: 'UC-030',
    type: 'stockIn',
    quantity: 50,
    signedQuantity: 50,
    beforeStock: 28,
    afterStock: 78,
    unit: 'pcs',
    reason: 'Purchase Order Delivered',
    createdAt: getRecentDate(2)
  },
  {
    id: 'mov_2',
    productId: 'prod_4',
    productName: 'Thermal Receipt Rolls',
    sku: 'TR-100',
    type: 'stockOut',
    quantity: 10,
    signedQuantity: -10,
    beforeStock: 10,
    afterStock: 0,
    unit: 'rolls',
    reason: 'Sales Order Fulfilled',
    relatedOrderId: 'ord_something',
    createdAt: getRecentDate(4)
  },
  {
    id: 'mov_3',
    productId: 'prod_9',
    productName: 'Hand Soap 500ml',
    sku: 'SOAP-500',
    type: 'adjustment',
    quantity: 2,
    signedQuantity: -2,
    beforeStock: 10,
    afterStock: 8,
    unit: 'bottles',
    reason: 'Damaged item',
    note: 'Found leak in packaging',
    createdAt: getRecentDate(5)
  },
  {
    id: 'mov_4',
    productId: 'prod_1',
    productName: 'Wireless Mouse',
    sku: 'WM-001',
    type: 'return',
    quantity: 3,
    signedQuantity: 3,
    beforeStock: 142,
    afterStock: 145,
    unit: 'pcs',
    reason: 'Customer Return',
    note: 'Items unopened',
    createdAt: getRecentDate(7)
  },
  {
    id: 'mov_5',
    productId: 'prod_10',
    productName: 'Notebook Pack',
    sku: 'NB-PK3',
    type: 'stockOut',
    quantity: 15,
    signedQuantity: -15,
    beforeStock: 15,
    afterStock: 0,
    unit: 'packs',
    reason: 'Sales Order Fulfilled',
    createdAt: getRecentDate(9)
  },
  {
    id: 'mov_6',
    productId: 'prod_14',
    productName: 'Shampoo 400ml',
    sku: 'SHMP-400',
    type: 'stockIn',
    quantity: 100,
    signedQuantity: 100,
    beforeStock: 10,
    afterStock: 110,
    unit: 'bottles',
    reason: 'Restocking',
    createdAt: getRecentDate(11)
  },
  {
    id: 'mov_7',
    productId: 'prod_6',
    productName: 'LED Desk Lamp',
    sku: 'LED-DL01',
    type: 'stockOut',
    quantity: 8,
    signedQuantity: -8,
    beforeStock: 20,
    afterStock: 12,
    unit: 'pcs',
    reason: 'Sales Order SO-1032 Fulfilled',
    relatedOrderId: 'ord_8',
    createdAt: getRecentDate(14)
  },
  {
    id: 'mov_8',
    productId: 'prod_16',
    productName: 'Cardboard Box Medium',
    sku: 'BOX-MED',
    type: 'adjustment',
    quantity: 5,
    signedQuantity: 5,
    beforeStock: 295,
    afterStock: 300,
    unit: 'pcs',
    reason: 'Inventory Count',
    note: 'Found extra in secondary shelf',
    createdAt: getRecentDate(16)
  }
];

export const mockActivity: ActivityItem[] = [
  ...mockSalesOrders.filter(o => o.status !== 'draft').slice(0, 5).map(o => ({
    id: `act_o_${o.id}`,
    type: 'order' as const,
    message: `Sales Order ${o.orderNumber} ${o.status}`,
    timestamp: o.updatedAt,
    entityId: o.id
  })),
  ...mockInventoryMovements.slice(0, 5).map(m => ({
    id: `act_m_${m.id}`,
    type: 'inventory' as const,
    message: `Stock ${m.type === 'stockIn' ? 'In' : m.type === 'stockOut' ? 'Out' : m.type === 'adjustment' ? 'Adjustment' : 'Return'}: ${m.productName} (${m.signedQuantity > 0 ? '+' : ''}${m.signedQuantity})`,
    timestamp: m.createdAt,
    entityId: m.productId
  }))
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
