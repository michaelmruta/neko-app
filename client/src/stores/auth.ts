import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
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

    async function getList(model: string, page: number = 1, limit: number = 10, q: string = null) {
        try {
            const response = await fetch(`/api/${model}?page=${page}&limit=${limit}&q=${q}`);
            if (!response.ok) throw new Error(`Failed to fetch ${model}`);
            return await response.json();
        } catch (err) {
            console.error(`Error fetching ${model}:`, err);
            throw err;
        }
    }

    async function getItem(model: string, id: number) {
        try {
            const response = await fetch(`/api/${model}/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch ${model}`);
            return await response.json();
        } catch (err) {
            console.error(`Error fetching ${model}:`, err);
            throw err;
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
        getItem
    }
})