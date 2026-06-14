// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";

// -----------------------------
// AUTH HELPERS
// -----------------------------

export async function getAuthHeaders() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;

  return {
    Authorization: `Bearer ${token}`,
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
  const headers = await getAuthHeaders();

  const { data } = await api.get("/notes", {
    headers,
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await getAuthHeaders();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

// -----------------------------
// USER
// -----------------------------

export const getMe = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};