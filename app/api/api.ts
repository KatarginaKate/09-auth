import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://notes-back-a3ym.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
