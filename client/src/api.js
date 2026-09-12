// client/src/api.js
import axios from 'axios';

// Priorité à VITE_API_URL (utile en prod / déploiement). En dev, on utilise le
// hostname avec lequel la page a été chargée (localhost sur le Mac, IP du Mac
// si on ouvre la page depuis un téléphone sur le même Wi-Fi) : ça évite de
// coder une IP figée qui change à chaque réseau.
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

// NOTE : les fonctions requestPasswordReset / getUserDashboard / createPost / getPosts
// ont été retirées ici : elles appelaient des routes qui n'existent pas côté backend
// (/auth/forgot-password, /users/dashboard, /posts/posts) et n'étaient utilisées
// nulle part dans l'app. Si tu as besoin d'un "mot de passe oublié", il faudra
// d'abord créer la route correspondante côté serveur (authController + authRoutes).

export default API;