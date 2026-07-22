import axios from "axios";

const raw = process.env.NEXT_PUBLIC_API_URL ?? "";
const normalized = raw.replace(/\/+$/, ""); // прибирає всі слеші в кінці

export const api = axios.create({
  baseURL: `${normalized}`,
  withCredentials: true,
});
