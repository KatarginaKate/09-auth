"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  // ✅ LOADING
  if (isLoading) {
    return <div className={css.container}>Loading...</div>;
  }

  // ❌ ERROR (це те, чого не вистачало по рев’ю)
  if (isError) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Failed to load note</p>

          {error instanceof Error && (
            <p>{error.message}</p>
          )}

          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </Modal>
    );
  }

  // ❌ fallback якщо немає даних
  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Note not found</p>

          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </Modal>
    );
  }

  // ✅ SUCCESS
  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <button className={css.backBtn} onClick={handleClose}>
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