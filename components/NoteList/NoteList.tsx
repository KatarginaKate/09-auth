"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api/clientApi";
import Link from "next/link";

import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import type { FetchNotesResponse } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<FetchNotesResponse | undefined>(
        ["notes"],
        (current) => {
          if (!current) return current;

          return {
            ...current,
            notes: current.notes.filter((note) => {
              const currentId = note.id ?? (note as Note & { _id?: string })._id;
              return currentId !== deletedId;
            }),
          };
        }
      );

      queryClient.removeQueries({ queryKey: ["note", deletedId], exact: true });
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleDelete = (id: string) => {
    if (!id) {
      console.warn("Delete blocked: note id is missing");
      return;
    }

    console.log("DELETE note id:", id);
    deleteMutation.mutate(id);
  };

  if (!currentUser?.email) {
    return <ul className={css.list} />;
  }

  const visibleNotes = notes.filter((note) => {
    const noteEmails = [
      note.userEmail,
      note.ownerEmail,
      note.authorEmail,
      note.user?.email,
      note.owner?.email,
      note.author?.email,
    ].filter(Boolean) as string[];

    if (noteEmails.length === 0) {
      return false;
    }

    return noteEmails.some(
      (email) => email.toLowerCase() === currentUser.email.toLowerCase()
    );
  });

  return (
    <ul className={css.list}>
      {visibleNotes.map((note, index) => {
        const noteId = note.id ?? (note as Note & { _id?: string })._id;

        if (!noteId) return null;

        return (
          <li key={String(noteId ?? `note-${index}`)} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <Link href={`/notes/${noteId}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={() => handleDelete(noteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default NoteList;
