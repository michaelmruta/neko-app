import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
    const isLoading = ref(false)
    const error = ref('')

    async function getList(model: string, page: number = 1, limit: number = 10, q: string = '') {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch(`/api/${model}?page=${page}&limit=${limit}&q=${q}`);
            if (!response.ok) throw new Error(`Failed to fetch ${model}`);

            return await response.json();
        } catch (err) {
            console.error(`Error fetching ${model}:`, err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function getItem(model: string, id: number) {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch(`/api/${model}/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch ${model}`);

            return await response.json();
        } catch (err) {
            console.error(`Error fetching ${model}:`, err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function createItem(model: string, data: any) {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch(`/api/${model}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Failed to create ${model}`);

            return await response.json();
        } catch (err) {
            console.error(`Error creating ${model}:`, err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateItem(model: string, id: number, data: any) {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch(`/api/${model}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Failed to update ${model}`);

            return await response.json();
        } catch (err) {
            console.error(`Error updating ${model}:`, err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteItem(model: string, id: number) {
        try {
            isLoading.value = true
            error.value = ''

            const response = await fetch(`/api/${model}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Failed to delete ${model}`);

            return true;
        } catch (err) {
            console.error(`Error deleting ${model}:`, err);
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        error,
        getList,
        getItem,
        createItem,
        updateItem,
        deleteItem
    }
})