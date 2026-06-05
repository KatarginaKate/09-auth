import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub — Smart Notes Manager",
  description:
    "NoteHub — це сучасний застосунок для створення, редагування та організації особистих нотаток з підтримкою пошуку та модальних вікон.",

  openGraph: {
    title: "NoteHub — Smart Notes Manager",
    description:
      "NoteHub — швидкий і зручний застосунок для керування нотатками. Створюйте, редагуйте та організовуйте свої записи легко.",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — Notes Manager App",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body>
        <Providers>
          <Header />
          <main>
            {children}
            {modal}
            <div id="modal-root"></div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
