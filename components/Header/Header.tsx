import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <AuthNavigation />
          <ThemeToggle />
        </ul>
      </nav>
    </header>
  );
};

export default Header;