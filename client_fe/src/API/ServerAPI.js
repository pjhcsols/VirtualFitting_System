import axios from "axios";

const BASE_URL = "http://155.230.43.12:8090/";

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
        