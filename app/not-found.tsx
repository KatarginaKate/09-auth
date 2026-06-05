// app/not-found.tsx

import css from "./Home.module.css";

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сторінку не знайдено — 404 | NoteHub",
  description:
    "Ця сторінка не існує. Можливо, посилання застаріло або було введено неправильно.",

  openGraph: {
    title: "Сторінку не знайдено — 404 | NoteHub",
    description:
      "Вибачте, але сторінка, яку ви шукаєте, не існує. Перевірте адресу або поверніться на головну.",
    url: "https://3000.not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — Page Not Found",
      },
    ],
  },
};

export default NotFound;
