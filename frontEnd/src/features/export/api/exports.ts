import { apiRequest } from '../../../config/api';

export interface ExportData {
  id: number;
  code: string;
  person_id: number;
  person?: { id: number; name: string };
  amount: string;
  reason: string;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExportPayload {
  person_id: number;
  amount: number;
  reason: string;
  note?: string;
  date: string;
}

export async function getExports(): Promise<ExportData[]> {
  const res = await apiRequest<{ data: ExportData[] }>('/exports');
  return res.data;
}

export async function createExport(
  payload: CreateExportPayload,
): Promise<ExportData> {
  const res = await apiRequest<{ data: ExportData }>('/exports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteExport(id: number): Promise<void> {
  await apiRequest(`/exports/${id}`, { method: 'DELETE' });
}
