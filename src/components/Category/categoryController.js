import {api} from "../api.js";

export async function addCategory(budgetId, data) {
    try {
        const response = await api.post(`budgets/${budgetId}/categories/add`, {
            categoryId: data.categoryId,
            description: data.description,
            defaultType: data.defaultType,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function changeCatStatus(budgetId, catId) {
    try {
        const response = await api.get(`budgets/${budgetId}/categories/${catId}/changeStatus`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateCategory(budgetId, catId, data) {
    try {
        const response = await api.put(`budgets/${budgetId}/categories/${catId}`, {
            description: data.description,
            defaultType: data.defaultType,
        });
        return response;
    } catch (error) {
        throw error;
    }
}