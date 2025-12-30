export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

export const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};
