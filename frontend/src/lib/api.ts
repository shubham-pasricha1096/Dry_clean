import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // This should be in an env variable
});

export default api;
