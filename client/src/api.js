// client/src/api.js

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`;

const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    try {
        const response = await API.post('/auth/login', { email, password });
        return { success: true, data: response.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Erreur de connexion' 
        };
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/auth/register', userData);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Erreur d'inscription" };
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await API.post('/auth/forgot-password', { email });
        return { success: true, message: response.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Erreur lors de la demande' };
    }
};

export const getUserDashboard = async () => {
    try {
        const response = await API.get('/users/dashboard');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: 'Impossible de récupérer les données' };
    }
};

export const createPost = async (formData) => {
    try {
        const response = await API.post('/posts/posts', formData);
        return { success: true, post: response.data.post };
    } catch (error) {
        return { success: false, message: 'Échec de la création du post' };
    }
};

export const getPosts = async () => {
    try {
        const response = await API.get('/posts/posts');
        return { success: true, posts: response.data.posts };
    } catch (error) {
        return { success: false, message: 'Échec de la récupération des posts' };
    }
};

export default API;