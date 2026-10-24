import axios from 'axios';

// Default to backend at localhost:8000/api if not specified
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Centralized Axios instance for QueueCare AI backend communication
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Health check helper to verify if the real backend server is running
 * @returns {Promise<{ online: boolean, message: string }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/health', { timeout: 2500 });
    return {
      online: true,
      data: response.data,
      message: 'Backend API is connected and online',
    };
  } catch (error) {
    return {
      online: false,
      data: null,
      message: error.response
        ? `Backend returned status ${error.response.status}`
        : 'Backend server is not reachable at ' + API_BASE_URL,
    };
  }
}

export default apiClient;
