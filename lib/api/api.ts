import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const api = axios.create({
  baseURL: "https://09-auth-five-omega.vercel.app/api",
  withCredentials: true,
});