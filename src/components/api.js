import axios from "axios";

const API_URL="https://localhost:7148"

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    /*httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })*/
})