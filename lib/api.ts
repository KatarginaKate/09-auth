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
  tag?: NoteTag;
}

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams) => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
  });
  return response.data;
};

export const createNote = async (
  note: CreateNoteParams
): Promise<Note> => {
  const response = await axios.post<Note>(
    "/notes",
    note
  );

  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const response = await axios.delete<Note>(
    `/notes/${id}`
  );

  return response.data;
};

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const response = await axios.get<Note>(
    `/notes/${id}`
  );

  return response.data;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(
    "/categories"
  );

  return response.data;
};