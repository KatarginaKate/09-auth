"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  category?: string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const tag: NoteTag | undefined =
    category && category !== "all" ? (category as NoteTag) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
        ...(tag ? { tag } : {}),
      }),

    placeholderData: (prev) => prev,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {/* ✅ ВИМОГА: Modal + children + onClose */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}