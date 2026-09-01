"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api/clientApi";
import Link from "next/link";

import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import type { FetchNotesResponse } from "../../lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<FetchNotesResponse | undefined>(
        ["notes"],
        (current) => {
          if (!current) return current;

          return {
            ...current,
            notes: current.notes.filter((note) => note.id !== deletedId),
          };
        }
      );

      queryClient.removeQueries({ queryKey: ["note", deletedId], exact: true });
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleDelete = (id: string) => {
    if (!id) {
      return;
    }

    deleteMutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note, index) => (
        <li key={String(note.id ?? `note-${index}`)} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>

          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            {/* 🔥 Додаємо View details */}
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
