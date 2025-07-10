import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
    id: number
    name: string | null
    email: string
    role: string
    isVerified: boolean
    avatar: string | null
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref('')

    const isAuthenticated = computed(() => !!user.value)

    // Initialize user from session if available
    async function initializeAuth() {
        try {
            isLoading.value = true
            const response = await fetch('/api/users/me')

            if (response.ok) {
                const userData = await response.json()
                user.value = userData
            }
        } catch (err) {
            console.error('Failed to initialize auth:', err)
        } finally {
            isLoading.value = false
        }
    }

    async function login(email, password) {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            user.value = data.user
            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function logout() {
        try {
            isLoading.value = true
            const response = await fetch('/api/users/logout')

            if (response.ok) {
                user.value = null
            } else {
                throw new Error('Logout failed')
            }
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Generic API methods for data operations
    async function getList(resource, page = 1, limit = 10, query = '') {
        try {
            isLoading.value = true
            const response = await axios.get(`/api/${resource}`, {
                params: { page, limit, q: query },
                withCredentials: true
            })
            return response.data
        } catch (err) {
            console.error(`Failed to fetch ${resource} list:`, err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function getItem(resource, id) {
        try {
            isLoading.value = true
            const response = await axios.get(`/api/${resource}/${id}`, {
                withCredentials: true
            })
            return response.data
        } catch (err) {
            console.error(`Failed to fetch ${resource} item:`, err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function createItem(resource, data) {
        try {
            isLoading.value = true
            const response = await axios.post(`/api/${resource}`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (err) {
            console.error(`Failed to create ${resource}:`, err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function updateItem(resource, id, data) {
        try {
            isLoading.value = true
            const response = await axios.put(`/api/${resource}/${id}`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (err) {
            console.error(`Failed to update ${resource}:`, err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function deleteItem(resource, id) {
        try {
            isLoading.value = true
            const response = await axios.delete(`/api/${resource}/${id}`, {
                withCredentials: true
            })
            return response.data
        } catch (err) {
            console.error(`Failed to delete ${resource}:`, err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        initializeAuth,
        getList,
        getItem,
        createItem,
        updateItem,
        deleteItem
    }
})