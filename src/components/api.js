import axios from "axios";

const API_URL="https://192.168.1.108:1234"
export const SOCKET_URL = "wss://192.168.1.108:1234/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})