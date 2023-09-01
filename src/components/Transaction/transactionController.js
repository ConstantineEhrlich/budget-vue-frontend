import {api} from "../api.js";

export async function getTransactions(budgetId){
    try{
        const response = await api.get(`budgets/${budgetId}/transactions`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}