"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

export default function NotesClient({ category }: { category?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isFiltered = Boolean(category);

  const { data } = useQuery({
  queryKey: ["notes", page, search, category || ""],

  queryFn: () =>
    fetchNotes({
      page,
      perPage: 12,
      search,
      tag: category || undefined,
    }),

  placeholderData: (prev) => prev,
});
  const { isLoading, isError } = useQuery({
  queryKey: ["notes", page, search, category || ""],
    placeholderData: (prev) => prev,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {!isFiltered && (
          <>
            <SearchBox onSearch={handleSearch} />

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {isOpen && <NoteForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}
