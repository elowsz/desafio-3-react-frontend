import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.1.254:3000', // substitua pelo IP do seu backend
  timeout: 5000,
});
