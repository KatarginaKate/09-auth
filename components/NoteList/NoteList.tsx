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

  return (
    <ul className={css.list}>
      {notes.map((note, index) => {
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
