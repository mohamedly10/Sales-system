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
  created_at: string;
  updated_at: string;
}

export interface CreatePersonPayload {
  name: string;
  phone?: string;
  company?: string;
  address?: string;
  status?: string;
  notes?: string;
}

export async function getPeople(): Promise<PersonData[]> {
  const res = await apiRequest<{ data: PersonData[] }>('/persons');
  return res.data;
}

export async function createPerson(
  payload: CreatePersonPayload,
): Promise<PersonData> {
  const res = await apiRequest<{ data: PersonData }>('/persons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deletePerson(id: number): Promise<void> {
  await apiRequest(`/persons/${id}`, { method: 'DELETE' });
}
