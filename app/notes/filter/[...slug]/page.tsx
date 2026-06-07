import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";
  const readableTag = tag === "all" ? "Усі нотатки" : `Фільтр: ${tag}`;

  const title = `${readableTag} | NoteHub`;
  const description = `Сторінка з нотатками, відфільтрованими за категорією: ${tag}.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://3000/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub — ${readableTag}`,
        },
      ],
    },
  };
}


export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const raw = slug[0];
  const tag = raw === "all" ? undefined : (raw as Parameters<typeof fetchNotes>[0]["tag"]);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        ...(tag ? { tag } : {}),
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient category={tag ?? "all"} />
    </HydrationBoundary>
  );
}