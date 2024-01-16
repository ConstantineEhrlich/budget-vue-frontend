import axios from "axios";

const API_URL = "https://localhost:8765"
export const SOCKET_URL = "wss://localhost:8765/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})