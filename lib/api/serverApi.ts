// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";

// -----------------------------
// HELPERS
// -----------------------------

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  };
}

// -----------------------------
// NOTES
// -----------------------------

export const fetchNotes = async (params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}) => {
  const authHeaders = await getAuthHeaders();

  const response = await api.get("/notes", {
    ...authHeaders,
    params,
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const authHeaders = await getAuthHeaders();

  const response = await api.get(`/notes/${id}`, authHeaders);

  return response.data;
};

// -----------------------------
// AUTH
// -----------------------------

export const getMe = async () => {
  const authHeaders = await getAuthHeaders();

  const response = await api.get("/auth/me", authHeaders);

  return response.data;
};

export const checkSession = async () => {
  const authHeaders = await getAuthHeaders();

  const response = await api.get("/auth/session", authHeaders);

  return response.data;
};
