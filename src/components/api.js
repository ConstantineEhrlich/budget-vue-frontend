import axios from "axios";

const API_URL = "https://api.mybudget.today/"
export const SOCKET_URL = "wss://api.mybudget.today/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})