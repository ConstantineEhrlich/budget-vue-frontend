import {api} from "../api.js";

export async function userLogin(data) {
    try {
        const response = await api.post("/user/login", {
            login: data.id,
            password: data.password,
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function userLogout() {
    try {
        const response = await api.get("/user/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUserProfile() {
    try {
        const response = await api.get(`/profile`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function userSignUp(data) {
    try {
        const response = await api.post("user/signup", {
            login: data.id,
            name: data.name,
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}