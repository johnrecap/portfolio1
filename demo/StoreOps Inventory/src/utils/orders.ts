import { SalesOrderItem } from '../types/inventory';

export function calculateOrderTotals(items: SalesOrderItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const estimatedCost = items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
  const estimatedProfit = subtotal - estimatedCost;

  return { subtotal, estimatedCost, estimatedProfit };
}
