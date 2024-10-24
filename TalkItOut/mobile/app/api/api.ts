import axios from 'axios';

const api = axios.create({
  baseURL: 'https:localhost:5001',
  // timeout: 1000,
});

export default api;
