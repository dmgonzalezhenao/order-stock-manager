import axios from 'axios';

// Instancia global de Axios con la configuración de la API .NET 8
const api = axios.create({
  // Asegúrate de que el puerto coincida con la URL https/http donde corre tu backend
  baseURL: 'http://localhost:5168/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta (QA / Manejo de Errores Global)
// Captura automáticamente errores de servidor o fallos de red antes de llegar al componente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Error de red o el servidor Backend no está respondiendo.');
    } else {
      console.error(`Error HTTP ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;