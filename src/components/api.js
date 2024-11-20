import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL

const API_URL = `https://${baseURL}/`;
export const SOCKET_URL = `wss://${baseURL}/budgets/`;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})