import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7248/api', // ASP.NET API endpoint
});

export const getNotes = () => API.get('/notes');
export const createNote = (data) => API.post('/notes', data);
