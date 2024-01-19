import axios from "axios";

const API_URL = "http://api.localhost/"
export const SOCKET_URL = "ws://api.localhost/budgets/";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})