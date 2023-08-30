import {api} from "./api.js";

export async function userLogin(username, password){
    try{
        const response = await api.post("/user/login", {
            userid: username,
            password: password,
        })
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function userLogout(){
    try{
        const response = await api.get("/user/logout");
        return response.data;
    }
    catch(error){

        throw error;
    }
}

export async function getUserProfile(id = ""){
    return api.get(`user/profile/${id}`)
        .then(response => {
            console.log("Successfuly obtained user")
            return response.data;
        })
        .catch(error => {
            console.error("Failed to load user");
            throw error;
        });
}