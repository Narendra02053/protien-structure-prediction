import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const predictStructure = async (sequence) => {
    const response = await axios.post(`${API_URL}/predict`, { sequence });
    return response.data;
};
