import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const userService = {
    getList: async (page = 1, limit = 10, query = '') => {
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

    getById: async (id: number) => {
        try {
            const response = await api.get(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error)
            throw error
        }
    },

    create: async (userData: any) => {
        try {
            const response = await api.post('/users', userData)
            return response.data
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    },

    update: async (id: number, userData: any) => {
        try {
            const response = await api.put(`/users/${id}`, userData)
            return response.data
        } catch (error) {
            console.error(`Error updating user ${id}:`, error)
            throw error
        }
    },

    delete: async (id: number) => {
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