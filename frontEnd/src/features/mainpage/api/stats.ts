import { apiRequest } from '../../../config/api';

export interface Stats {
  total_persons: number;
  total_exports: number;
  total_exports_amount: number;
  total_imports: number;
  total_imports_amount: number;
  balance: number;
  today_operations: number;
}

export async function getStats(): Promise<Stats> {
  return apiRequest<Stats>('/stats');
}
