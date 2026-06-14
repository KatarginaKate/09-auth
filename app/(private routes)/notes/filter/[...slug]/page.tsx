import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { fetchNotes } from "../../../../../lib/api/serverApi";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function NotesPage({
  params,
}: NotesPageProps) {
  const { slug = ["all"] } = await params;

  const raw = slug[0];

  const tag =
    raw?.toLowerCase() === "all"
      ? undefined
      : raw;

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

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NotesClient
        category={tag ?? "all"}
      />
    </HydrationBoundary>
  );
}