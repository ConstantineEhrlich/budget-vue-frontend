import {api} from "../api.js";

export async function getSummaryByCategory(budgetId, year, period){
    try {
        const response = await api.get(`budgets/${budgetId}/SummaryByCategory?year=${year}&period=${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSummaryByOwner(budgetId, year, period){
    try {
        const response = await api.get(`budgets/${budgetId}/SummaryByOwner?year=${year}&period=${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function getOpeningBalance(budgetId, year, period){
    try {
        const response = await api.get(`budgets/${budgetId}/GetOpeningBalance?year=${year}&period=${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getClosingBalance(budgetId, year, period){
    try {
        const response = await api.get(`budgets/${budgetId}/GetClosingBalance?year=${year}&period=${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}