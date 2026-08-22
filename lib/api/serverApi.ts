import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// -----------------------------
// COOKIE HEADER (SSR)
// -----------------------------

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();

  return all.map(c => `${c.name}=${c.value}`).join("; ");
}

// -----------------------------
// NOTES
// -----------------------------

export const fetchNotes = async (params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieHeader = await getCookieHeader();
  const { data } = await api.get("/notes", {
    headers: {
      Cookie: cookieHeader,
    },
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

// -----------------------------
// USER
// -----------------------------

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await fetch("http://localhost:3000/api/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
};

// -----------------------------
// SESSION
// -----------------------------

export const checkSession = async () => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  return response;
};

