import { apiRequest } from '../../../config/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    data: { email, password },
  });
}

export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/logout', {
    method: 'POST',
  });
}
