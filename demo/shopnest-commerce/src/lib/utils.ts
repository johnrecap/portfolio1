import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function calculateDiscountPrice(price: number, discountPercentage?: number) {
  if (!discountPercentage) return price;
  return price * (1 - discountPercentage / 100);
}
