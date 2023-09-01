import axios from "axios";

const API_URL="https://192.168.1.108:7148"

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    /*httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })*/
})