"use client";

import { useEffect, useState } from "react";
import css from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  };

  const nextThemeLabel = theme === "dark" ? "light" : "dark";

  return (
    <li className={css.item}>
      <button
        type="button"
        className={css.button}
        onClick={toggleTheme}
        suppressHydrationWarning
        aria-label={`Switch to ${nextThemeLabel} theme`}
        title={`Switch to ${nextThemeLabel} theme`}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </li>
  );
}
