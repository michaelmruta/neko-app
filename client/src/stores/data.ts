import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', () => {
    async function getList(model: string, page: number = 1, limit: number = 10, q: string = null) {
        // ... existing getList implementation ...
    }

    async function getItem(model: string, id: number) {
        // ... existing getItem implementation ...
    }

    return { getList, getItem };
});