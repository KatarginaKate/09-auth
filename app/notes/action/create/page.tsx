import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a new note | NoteHub",
  description:
    "Сторінка для створення нової нотатки у NoteHub. Додайте заголовок, текст та тег, щоб зберегти новий запис.",

  openGraph: {
    title: "Create a new note | NoteHub",
    description:
      "Створіть нову нотатку у NoteHub. Заповніть форму та додайте свій запис до списку нотаток.",
    url: "https://3000/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — Create new note",
      },
    ],
  },
};


export default function CreateNote() {
  const handleClose = () => {

  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
