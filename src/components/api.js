import axios from "axios";

const API_URL="https://207.154.196.239:5117"
export const SOCKET_URL = "wss://207.154.196.239:5117/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})