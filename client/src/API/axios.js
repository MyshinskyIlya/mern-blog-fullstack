import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:4444",
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token"); // Вшиваем токен при каждом (любом) запросе в Header в Network Headers

    return config;
});

export default instance;
