import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// -----------------------------
// AUTH HELPERS (CONSISTENT COOKIE ONLY)
// -----------------------------

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Якщо токенів немає — повертаємо порожній рядок
  if (!accessToken || !refreshToken) return "";

  // Порядок має значення
  return `accessToken=${accessToken}; refreshToken=${refreshToken}`;
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

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
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

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

// -----------------------------
// SESSION
// -----------------------------

export const checkSession = async (): Promise<
  import("axios").AxiosResponse
> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  return response;
};