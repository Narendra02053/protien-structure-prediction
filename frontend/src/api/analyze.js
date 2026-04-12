import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const analyzeMutation = async (sequence, mutation, gene_name) => {
    const response = await axios.post(`${API_URL}/analyze`, { sequence, mutation, gene_name });
    return response.data;
};
