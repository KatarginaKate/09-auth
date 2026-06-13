// lib/api/clientApi.ts
import { api } from './api';
import type { Note, NoteTag } from '@/types/note';

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

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const response = await api.post<Note>('/notes', data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

// -----------------------------
// AUTH
// -----------------------------

export const register = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const checkSession = async () => {
  const response = await api.get('/auth/session');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateMe = async (data: UpdateMeParams) => {
  const formData = new FormData();

  if (data.name) formData.append('name', data.name);
  if (data.email) formData.append('email', data.email);
  if (data.avatar) formData.append('avatar', data.avatar);

  const response = await api.patch('/auth/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};


