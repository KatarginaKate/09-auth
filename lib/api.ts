import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common.Authorization = `Bearer ${token}`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface CreateNoteParams {
  title: string;
  content: string;
  tag: string; // 
}

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
    search,
  };

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const response = await axios.get("/notes", { params });

  return {
    notes: response.data.notes ?? [],
    totalPages: response.data.totalPages ?? 1,
  };
};

// GET BY ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get(`/notes/${id}`);
  return response.data;
};

// CREATE
export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response = await axios.post("/notes", note);
  return response.data;
};

// DELETE
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`/notes/${id}`);
  return response.data;
};

// SIMPLE GET FOR SIDEBAR
export const getNotes = async (tag?: NoteTag | "all"): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page: 1,
    perPage: 12,
  };

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const response = await axios.get("/notes", { params });

  return {
    notes: response.data.notes ?? [],
    totalPages: response.data.totalPages ?? 1,
  };
};
