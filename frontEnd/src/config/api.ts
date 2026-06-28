import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = '/api';


const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. The Wrapper Function
export async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig, // Replaced RequestInit with AxiosRequestConfig
): Promise<T> {
  try {
    // Axios takes a config object where you can pass url, method, data, etc.
    const response = await apiClient({
      url: endpoint,
      ...options,
    });

    // Handle the 204 No Content edge case
    if (response.status === 204) return undefined as T;

    // Axios automatically parses JSON, so we just return .data
    return response.data;

  } catch (error: any) {
    // Axios automatically throws on non-2xx status codes.
    // We extract the message from the backend response, or fallback to default messages.
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Request failed with status ${error.response?.status}`;

    throw new Error(errorMessage);
  }
}