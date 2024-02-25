import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    response => response,
    error => {
        console.log(error.response);
        if (error.response && error.response.data.unauthorized) {
            window.dispatchEvent(new CustomEvent('redirectToLogin', {
                detail: {
                    message: error.response.data.error
                }
            }));
        }
        return Promise.reject(error);
    }
);

export default instance;
