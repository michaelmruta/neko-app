import axios, { AxiosInstance } from 'axios'

// Extend AxiosInstance type to include our custom methods
interface ExtendedAxiosInstance extends AxiosInstance {
    getItem: (resource: string, id: number | string) => Promise<any>;
    createItem: (resource: string, data: any) => Promise<any>;
    updateItem: (resource: string, id: number | string, data: any) => Promise<any>;
    deleteItem: (resource: string, id: number | string) => Promise<any>;
}

// Create the axios instance
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
}) as ExtendedAxiosInstance

// Generic API methods for data operations
api.getItem = async (resource, id) => {
    try {
        const response = await api.get(`/${resource}/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching ${resource} item:`, error)
        throw error
    }
}

api.createItem = async (resource, data) => {
    try {
        const response = await api.post(`/${resource}`, data)
        return response.data
    } catch (error) {
        console.error(`Error creating ${resource}:`, error)
        throw error
    }
}

api.updateItem = async (resource, id, data) => {
    try {
        const response = await api.put(`/${resource}/${id}`, data)
        return response.data
    } catch (error) {
        console.error(`Error updating ${resource}:`, error)
        throw error
    }
}

api.deleteItem = async (resource, id) => {
    try {
        const response = await api.delete(`/${resource}/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error deleting ${resource}:`, error)
        throw error
    }
}

// Define interfaces for better type safety
interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    role?: string;
    status?: string;
    lastLogin?: Date;
    isVerified?: boolean;
    avatar?: string;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    googleId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PaginatedResponse<T> {
    results: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

export const userService = {
    getList: async (page = 1, limit = 10, query = ''): Promise<PaginatedResponse<User>> => {
        try {
            const response = await api.get('/users', {
                params: { page, limit, q: query }
            })
            return response.data
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    },

    getById: async (id: number | string): Promise<{ data: User }> => {
        try {
            const response = await api.get(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error)
            throw error
        }
    },

    create: async (userData: User): Promise<{ data: User }> => {
        try {
            const response = await api.post('/users', userData)
            return response.data
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    },

    update: async (id: number | string, userData: User): Promise<{ data: User }> => {
        try {
            const response = await api.put(`/users/${id}`, userData)
            return response.data
        } catch (error) {
            console.error(`Error updating user ${id}:`, error)
            throw error
        }
    },

    delete: async (id: number | string): Promise<any> => {
        try {
            const response = await api.delete(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error)
            throw error
        }
    }
}

export default api