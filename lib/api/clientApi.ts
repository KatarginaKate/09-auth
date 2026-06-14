import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

export const clientApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
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
  username?: string;
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

export const createNote = async (
  data: CreateNoteParams
): Promise<Note> => {
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

// ❌ backend НЕ очікує name
export const register = async (data: {
  email: string;
  password: string;
}) => {
  const res = await clientApi.post("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
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

// -----------------------------
// USER
// -----------------------------

// ❗ тільки username (як в вимогах)
export const updateMe = async (data: UpdateMeParams) => {
  const formData = new FormData();

  if (data.username) {
    formData.append("username", data.username);
  }

  const res = await clientApi.patch("/users/me", formData);

  return res.data;
};