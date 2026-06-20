import { apiRequest } from '../../../config/api';

export interface ImportData {
  id: number;
  code: string;
  person_id: number;
  person?: { id: number; name: string; company?: string };
  amount: string;
  reason: string;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImportPayload {
  person_id: number;
  amount: number;
  reason: string;
  note?: string;
  date: string;
}

export async function getImports(): Promise<ImportData[]> {
  const res = await apiRequest<{ data: ImportData[] }>('/imports');
  return res.data;
}

export async function createImport(
  payload: CreateImportPayload,
): Promise<ImportData> {
  const res = await apiRequest<{ data: ImportData }>('/imports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteImport(id: number): Promise<void> {
  await apiRequest(`/imports/${id}`, { method: 'DELETE' });
}
