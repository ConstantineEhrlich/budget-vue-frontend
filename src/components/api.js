import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})