// lib/api/clientApi.ts
import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

export const clientApi = axios.create({
  baseURL: "/api",
  withCredentials: true, // 🔥 КЛЮЧОВЕ для 401 fix
});

// -----------------------------
// TYPES
// -----------------------------

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | string;
}

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

interface UpdateMeParams {
  name?: string;
  email?: string;
  avatar?: File | null;
}

// -----------------------------
// NOTES
// -----------------------------

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await clientApi.get("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await clientApi.get(`/notes/${id}`);
  return data;
};

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await clientApi.post("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await clientApi.delete(`/notes/${id}`);
  return res.data;
};

// -----------------------------
// AUTH
// -----------------------------

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await clientApi.post("/auth/register", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await clientApi.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await clientApi.post("/auth/logout");
  return res.data;
};

export const checkSession = async () => {
  const res = await clientApi.get("/auth/session");
  return res.data;
};

export const getMe = async () => {
  const res = await clientApi.get("/users/me");
  return res.data;
};

export const updateMe = async (data: UpdateMeParams) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.avatar) formData.append("avatar", data.avatar);

  const res = await clientApi.patch("/auth/me", formData);
  return res.data;
};

