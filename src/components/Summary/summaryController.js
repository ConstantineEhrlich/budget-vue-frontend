import {api} from "../api.js";

export async function getSummaryByCategory(budgetId, year, period){
    try {
        const response = await api.get(`budgets/${budgetId}/SummaryByCategory?year=${year}&period=${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}