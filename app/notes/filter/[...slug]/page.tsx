// app/notes/filter/[...slug]/page.tsx — SERVER COMPONENT

import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage({ params }: { params: { slug: string[] } }) {
  const slug = params?.slug || [];
  const tag = slug[0] === "all" ? "" : slug[0]; 

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
  queryKey: ["notes", 1, "", tag || ""],
  queryFn: () =>
    fetchNotes({
      page: 1,
      perPage: 12,
      search: "",
      tag: tag || undefined,
    }),
});

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient category={tag} />
    </HydrationBoundary>
  );
}
