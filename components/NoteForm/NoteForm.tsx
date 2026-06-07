"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote } from "../../lib/api";
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

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft(); // очищаємо чернетку
      router.back(); // повертаємося назад
    },
  });

  async function handleSubmit(formData: FormData) {
    const values: FormValues = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as FormValues["tag"],
    };

    createMutation.mutate(values);
  }

  function handleCancel() {
    router.back(); // draft НЕ очищаємо
  }

  return (
    <form action={handleSubmit} className={css.form}>
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
    </form>
  );
}
