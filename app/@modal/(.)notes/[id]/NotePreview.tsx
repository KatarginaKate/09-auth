"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./NotePreview.module.css";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

async function fetchNoteById(id: string) {
  const res = await fetch(`https://notehub-public.goit.study/api/notes/${id}`);

  if (!res.ok) throw new Error("Note not found");

  return res.json();
}

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading || !note) {
    return <div className={css.container}>Loading...</div>;
  }

  return (
    <Modal onClose={() => router.back()}>
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
    </Modal>
  );
}
