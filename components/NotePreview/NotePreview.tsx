"use client";

import css from "./NotePreview.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  title: string;
  tag: string;
  content: string;
  createdAt: string;
}

async function fetchNoteById(id: string): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`);
  return res.json();
}

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNoteById(id).then((n: Note) => setNote(n));
  }, [id]);

  if (!note) return <div className={css.container}>Loading...</div>;

  return (
    <div className={css.container}>
      <button className={css.backBtn} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
