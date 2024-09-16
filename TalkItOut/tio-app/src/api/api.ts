import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Uses the environment variable
});

export const getUsers = async () => {
  try {
    const response = await api.get('/users'); // Adjust based on your API
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
