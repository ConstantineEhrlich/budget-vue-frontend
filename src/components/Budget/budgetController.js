import {api} from "../api.js";

export async function getBudget(id){
    try{
        const response = await api.get(`budgets/${id}`);
    }
    catch(error){
        throw error;
    }
}


export async function getBudgets(){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function addBudget(){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function hideBudget(){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function addOwner(budgetId, ownerId){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function removeOwner(){
    try{

    }
    catch(error){
        throw error;
    }
}

export async function updateBudget(){
    try{

    }
    catch(error){
        throw error;
    }
}