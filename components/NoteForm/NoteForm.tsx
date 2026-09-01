"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote } from "@/lib/api/clientApi";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";

import css from "./NoteForm.module.css";

export interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Zustand
  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  // Локальний стейт форми (ініціалізується з draft)
  const [title, setTitle] = useState(draft.title || initialDraft.title);
  const [content, setContent] = useState(draft.content || initialDraft.content);
  const [tag, setTag] = useState<FormValues["tag"]>(
    (draft.tag as FormValues["tag"]) || initialDraft.tag
  );
  const [error, setError] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to create note";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const errorObj = error as any;
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }

      setError(errorMessage);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    // Get form values directly from state (already controlled)
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const values: FormValues = {
      title: title.trim(),
      content: content.trim(),
      tag: tag,
    };

    createMutation.mutate(values);
  }

  function handleCancel() {
    router.back(); // draft НЕ очищаємо
  }

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
            setDraft({ title: value });
          }}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={content}
          onChange={(e) => {
            const value = e.target.value;
            setContent(value);
            setDraft({ content: value });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => {
            const value = e.target.value as FormValues["tag"];
            setTag(value);
            setDraft({ tag: value });
          }}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Saving..." : "Create note"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
}
