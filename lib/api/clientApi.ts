import axios from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

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

const normalizeNote = (note: Partial<Note> & { _id?: string }): Note => {
  const id = note.id ?? note._id;

  if (!id) {
    throw new Error("Note id is missing");
  }

  return {
    ...note,
    id,
    createdAt: note.createdAt ?? "",
    updatedAt: note.updatedAt ?? "",
  } as Note;
};

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  message: string;
}

interface LogoutResponse {
  message: string;
}

interface SessionResponse {
  isLoggedIn: boolean;
}

interface UpdateMeParams {
  username?: string;
}

export interface UpdateAvatarResponse {
  url: string;
  avatar: string;
}


// -----------------------------
// NOTES
// -----------------------------

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await clientApi.get("/notes", { params });

  return {
    ...data,
    notes: Array.isArray(data?.notes)
      ? data.notes.map((note: Partial<Note> & { _id?: string }) => normalizeNote(note))
      : [],
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await clientApi.get(`/notes/${id}`);
  return normalizeNote(data);
};

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await clientApi.post("/notes", data);
  return normalizeNote(res.data);
};

export const deleteNote = async (id: string): Promise<Note> => {
  if (!id) {
    throw new Error("Note id is missing");
  }

  const res = await clientApi.delete(`/notes/${id}`);
  return normalizeNote(res.data);
};

// -----------------------------
// AUTH
// -----------------------------

export const register = async (data: {
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const res = await clientApi.post("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await clientApi.post("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const res = await clientApi.post("/auth/logout");
  return res.data;
};

export const checkSession = async (): Promise<SessionResponse> => {
  const res = await clientApi.get("/auth/session");
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await clientApi.get("/users/me");
  return res.data;
};

// -----------------------------
// USER
// -----------------------------

export const updateMe = async (data: UpdateMeParams): Promise<User> => {
  const res = await clientApi.patch("/users/me", data); // JSON, не FormData
  return res.data;
};

export const updateAvatar = async (
  file: File
): Promise<UpdateAvatarResponse> => {
  const formData = new FormData();

  formData.append("avatar", file);

  const { data } = await clientApi.patch("/users/me/avatar", formData);

  return data;
};
