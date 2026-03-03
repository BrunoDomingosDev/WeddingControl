import axios from 'axios';

const api = axios.create({
    // Atualizei com o seu link novo:
    baseURL: '/api'
});

export default api;