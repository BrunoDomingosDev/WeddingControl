import axios from 'axios';

const api = axios.create({
    baseURL: 'https://eartha-ureido-renetta.ngrok-free.dev/api',
});

// 1. Interceptor de REQUISIÇÃO (Coloca o Token na ida)
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Interceptor de RESPOSTA (Trata o erro 401 na volta)
api.interceptors.response.use(response => {
    return response;
}, error => {
    // Se o C# disser que não estamos autorizados, limpamos a chave falsa e voltamos pro Login
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;