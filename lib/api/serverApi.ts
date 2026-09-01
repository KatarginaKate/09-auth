import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { headers } from "next/headers";

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

  return {
    ...data,
    notes: Array.isArray(data?.notes)
      ? data.notes.map((note: Partial<Note> & { _id?: string }) => normalizeNote(note))
      : [],
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return normalizeNote(data);
};

// -----------------------------
// USER
// -----------------------------

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();
  const headersList = await headers();

  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const response = await fetch(
    `${protocol}://${host}/api/users/me`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

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

