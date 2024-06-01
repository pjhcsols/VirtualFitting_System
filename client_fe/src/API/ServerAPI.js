import axios from "axios";

const BASE_URL = "http://218.233.221.147:8080/";

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
