import axios from "axios";

const BASE_URL = "http://172.30.1.16:8080/";

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;