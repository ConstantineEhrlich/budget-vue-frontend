import {api} from "../api.js";

export async function getBudget(id) {
    try {
        const response = await api.get(`budgets/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function getAllBudgets() {
    try {
        const response = await api.get("budgets/");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMyBudgets() {
    try {
        const response = await api.get("budgets/my");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addBudget(description) {
    try {
        const response = await api.post("budgets/new", {
            description: description,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function hideBudget() {
    try {

    } catch (error) {
        throw error;
    }
}

export async function addOwner(budgetId, ownerId) {
    try {
        const response = await api.post(`budgets/${budgetId}/addOwner`, {
            userId: ownerId,
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function removeOwner(budgetId, ownerId) {
    try {
        const response = await api.post(`budgets/${budgetId}/removeOwner`, {
            userId: ownerId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateBudget() {
    try {

    } catch (error) {
        throw error;
    }
}