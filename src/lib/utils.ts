import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | undefined | null, decimals: number = 2): string {
  if (value === undefined || value === null) return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercentage(value: number | string | undefined | null): string {
  return `${formatNumber(value)}%`;
}

export function formatCurrency(value: number | string | undefined | null): string {
  return `$${formatNumber(value)}`;
}
