import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/serverApi";
import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

import type { Metadata } from "next";

export async function generateMetadata(
  params: Promise<{ id: string }> 
): Promise<Metadata> {
  const { id } = await params;

  // Отримуємо дані нотатки
  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;
  const description = note.content
    ? `${note.content.slice(0, 120)}…`
    : "Деталі вибраної нотатки.";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://vercel.com/katarginakates-projects/08-zustand/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub — ${note.title}`,
        },
      ],
    },
  };
}


export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      
        <NotePreview id={id} />
      
    </HydrationBoundary>
  );
}