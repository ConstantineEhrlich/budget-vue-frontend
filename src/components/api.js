import axios from "axios";

const API_URL = "https://api.mybudget.home.arpa/"
export const SOCKET_URL = "wss://api.mybudget.home.arpa/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})