import {api} from "../api.js";

export const transTypes = new Map([["Income", 5], ["Expense", 10], ["Forecast", 15], ["Recurring", 20]]);
export const typesTrans = new Map([[5, "Income"], [10, "Expense"], [15, "Forecast"], [20, "Recurring"]]);

export const dateRender = {
    month: 'short',
    day: 'numeric'
};

export const numRender = {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

export async function getTransactions(budgetId) {
    try {
        const response = await api.get(`budgets/${budgetId}/transactions`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addTransaction(budgetId, data) {
    try {
        const response = await api.post(`budgets/${budgetId}/transactions/add`, {
            categoryId: data.categoryId,
            amount: data.amount,
            description: data.description,
            transactionType: data.transactionType,
            ownerId: data.ownerId,
            date: data.date,
            year: data.year,
            period: data.period,
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}