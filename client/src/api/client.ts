import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Product {
    id: string; // MongoDB ObjectId serialized as string
    name: string;
    price: string; // Decimal comes back as string from API
    stock: number;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'price' | 'stock';
    sortOrder?: 'asc' | 'desc';
}

export const productApi = {
    getAll: async (params?: GetProductsParams) => {
        const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await apiClient.get<Product>(`/products/${id}`);
        return data;
    },

    create: async (payload: Omit<Product, 'id' | 'createdAt'>) => {
        const { data } = await apiClient.post<Product>('/products', payload);
        return data;
    },

    update: async (id: string, payload: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
        const { data } = await apiClient.put<Product>(`/products/${id}`, payload);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/products/${id}`);
        return data;
    },
};
