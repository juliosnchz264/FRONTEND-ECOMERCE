import axios from 'axios'

// Configuración base de axios para usuarios (ajusta la ruta /users según tu backend)
const API_URL = import.meta.env.VITE_BACKEND_URL + '/users'

// Aseguramos que las cookies se envíen siempre
axios.defaults.withCredentials = true

/**
 * Actualiza el perfil del usuario (incluyendo imagen de avatar)
 * @param {Object} data - Datos de texto (username, password, etc.)
 * @param {File} file - Archivo de imagen seleccionado
 */
export const updateUserService = async (data, file) => {
    try {
        const formData = new FormData();
        formData.append('username', data.username);
        
        // Solo añadimos la password si el usuario escribió algo
        if (data.password) {
            formData.append('password', data.password);
        }
        
        // 'avatar' debe coincidir con upload.single('avatar') de tu userRoutes.js
        if (file) {
            formData.append('avatar', file);
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
            method: 'PUT',
            body: formData,
            credentials: 'include', 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la actualización');
        }

        return await response.json();
        
    } catch (error) {
        console.error("Error en updateUserService:", error);
        return { success: false, message: error.message };
    }
};