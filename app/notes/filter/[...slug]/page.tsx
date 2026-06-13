import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api/serverApi";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params.slug ?? ["all"];

  const raw = slug[0];
  const tag =
    raw === "all"
      ? undefined
      : (raw as Parameters<typeof fetchNotes>[0]["tag"]);

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
