import {api} from "../api.js";

export async function addCat(budgetId, catId, catDescription){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function changeCatStatus(budgetId, catId){
    try{
        const response = await api.get(`budgets/${budgetId}/categories/${catId}/changeStatus`);
        return response;
    }
    catch(error){
        throw error;
    }
}