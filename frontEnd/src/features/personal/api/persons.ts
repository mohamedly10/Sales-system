import { apiRequest } from '../../../config/api';

export interface PersonData {
  id: number;
  code: string;
  name: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  status: string;
  notes: string | null;
}

export async function getPeople(): Promise<PersonData[]> {
  const res = await apiRequest<{ data: PersonData[] }>('/persons');
  return res.data;
}
