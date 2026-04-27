import { Product } from '../types/inventory';

export function deriveProductStatus(
  currentStock: number,
  reorderLevel: number,
  currentStatus: Product['status']
): Product['status'] {
  if (currentStatus === 'discontinued') return 'discontinued';
  
  if (currentStock <= 0) return 'outOfStock';
  if (currentStock <= reorderLevel) return 'lowStock';
  
  return 'inStock';
}
