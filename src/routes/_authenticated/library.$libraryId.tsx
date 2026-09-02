import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell, LoadingRows, StateBlock, StatusPill } from "@/components/AppShell";
import { fetchBooksByLibrary, fetchLibrary, mapsUrl, type ItemType } from "@/lib/libfind";

export const Route = createFileRoute("/_authenticated/library/$libraryId")({
  head: () => ({
    meta: [
      { title: "Library catalogue — LibFind" },
      {
        name: "description",
        content: "Search the books and magazines held at this library and check availability.",
      },
      { property: "og:title", content: "Library catalogue — LibFind" },
      {
        property: "og:description",
        content: "Search this library's books and magazines and check availability.",
      },
    ],
  }),
  component: LibraryDetail,
});

type Filter = "All" | ItemType;

function LibraryDetail() {
  const { libraryId } = Route.useParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const libraryQuery = useQuery({
    queryKey: ["library", libraryId],
    queryFn: () => fetchLibrary(libraryId),
  });
  const booksQuery = useQuery({
    queryKey: ["books", libraryId],
    queryFn: () => fetchBooksByLibrary(libraryId),
  });

  const term = search.trim().toLowerCase();
  const books = (booksQuery.data ?? []).filter(
    (b) =>
      (filter === "All" || b.type === filter) &&
      (term === "" ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)),
  );

  return (
    <AppShell>
      <section className="bg-azure-deep">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Link to="/home" className="font-mono text-xs text-cream/60 hover:text-paper">
            ← All libraries
          </Link>

          <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cream/60">
                Library detail
              </p>
              <h1 className="mt-2 text-balance font-display text-3xl font-bold text-paper">
                {libraryQuery.data?.name ?? (libraryQuery.isPending ? "Loading…" : "Library")}
              </h1>
            </div>
            {libraryQuery.data ? (
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="font-mono text-xs text-cream/50">
                  {libraryQuery.data.address} · {libraryQuery.data.city}
                </span>
                <a
                  href={mapsUrl(libraryQuery.data)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-ochre px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper transition-colors hover:bg-ochre-deep"
                >
                  ◎ Directions on Google Maps
                </a>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles or authors…"
              aria-label="Search this library"
              className="flex-1 rounded-lg bg-paper px-4 py-3 text-sm text-ink outline-none ring-1 ring-border placeholder:text-muted-foreground"
            />
            <div className="flex gap-2">
              {(["All", "Book", "Magazine"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "rounded-lg bg-ochre px-4 py-3 text-sm font-medium text-paper"
                      : "rounded-lg bg-paper/15 px-4 py-3 text-sm text-paper ring-1 ring-paper/20 hover:bg-paper/25"
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {booksQuery.isPending ? (
              <div className="[&_div]:bg-paper/10">
                <LoadingRows count={4} />
              </div>
            ) : booksQuery.isError ? (
              <StateBlock
                tone="error"
                title="Couldn't load this catalogue"
                description="Something went wrong fetching titles. Refresh to try again."
              />
            ) : books.length === 0 ? (
              <StateBlock
                title="No titles match"
                description={
                  (booksQuery.data ?? []).length === 0
                    ? "This library has no titles catalogued yet."
                    : "Try a different search term or filter."
                }
              />
            ) : (
              <ul className="divide-y divide-cream/10">
                {books.map((book, i) => (
                  <li key={book.id}>
                    <Link
                      to="/book/$bookId"
                      params={{ bookId: book.id }}
                      className="flex items-center gap-4 py-4"
                    >
                      <span className="w-8 shrink-0 font-mono text-xs text-cream/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-semibold tracking-tight text-paper">
                          {book.title}
                        </p>
                        <p className="text-sm text-cream/60">
                          {book.author} · {book.type}
                        </p>
                      </div>
                      <span className="ml-auto">
                        <StatusPill available={book.available} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
