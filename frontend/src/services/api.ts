import axios from 'axios';

// Create an Axios instance with a base URL for the API
export const api = axios.create({
  baseURL: 'http://localhost:4000',
});