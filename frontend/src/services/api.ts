import axios from 'axios';
import { AuthResponse, Vehicle, VehicleFormData, SearchFilters } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to automatically attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, role: 'user' | 'admin' = 'user', adminKey?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, role, adminKey });
    return response.data;
  },
};

export const vehicleAPI = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },
  search: async (filters: SearchFilters): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles/search', { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<Vehicle> => {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },
  create: async (data: VehicleFormData): Promise<Vehicle> => {
    const response = await api.post<Vehicle>('/vehicles', data);
    return response.data;
  },
  update: async (id: string, data: Partial<VehicleFormData>): Promise<Vehicle> => {
    const response = await api.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/vehicles/${id}`);
    return response.data;
  },
  purchase: async (id: string): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await api.post<{ message: string; vehicle: Vehicle }>(`/vehicles/${id}/purchase`);
    return response.data;
  },
  restock: async (id: string, quantity: number): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await api.post<{ message: string; vehicle: Vehicle }>(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  },
};

export default api;
