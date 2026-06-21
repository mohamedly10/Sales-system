import { apiRequest } from '../../../config/api';

export interface ReportItem {
  id: string;
  date: string;
  name: string;
  amount: number;
  desc: string;
  type: 'export' | 'import';
}

export interface ReportSummary {
  total_amount: number;
  total_count: number;
}

export interface ReportResponse {
  data: ReportItem[];
  summary: ReportSummary;
}

export interface ReportFilters {
  type?: string;
  date_from?: string;
  date_to?: string;
  person_id?: number;
  search?: string;
}

export async function getReports(
  filters?: ReportFilters,
): Promise<ReportResponse> {
  const params = new URLSearchParams();
  if (filters?.type && filters.type !== 'all') params.set('type', filters.type);
  if (filters?.date_from) params.set('date_from', filters.date_from);
  if (filters?.date_to) params.set('date_to', filters.date_to);
  if (filters?.person_id) params.set('person_id', String(filters.person_id));
  if (filters?.search) params.set('search', filters.search);

  const qs = params.toString();
  const endpoint = qs ? `/reports?${qs}` : '/reports';
  return apiRequest<ReportResponse>(endpoint);
}

export interface ReportPerson {
  id: number;
  name: string;
}

export async function getReportPersons(): Promise<ReportPerson[]> {
  const res = await apiRequest<{ data: ReportPerson[] }>('/reports/persons');
  return res.data;
}
