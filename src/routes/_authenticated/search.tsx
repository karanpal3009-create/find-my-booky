import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell, LoadingRows, StateBlock, StatusPill } from "@/components/AppShell";
import { fetchAllBooks, type ItemType } from "@/lib/libfind";

export const Route = createFileRoute("/_authenticated/search")({
  head: () => ({
    meta: [
      { title: "Search all titles — LibFind" },
      {
        name: "description",
        content:
          "Search across every Delhi library at once and see which one holds each title.",
      },
      { property: "og:title", content: "Search all titles — LibFind" },
      {
        property: "og:description",
        content: "Search books and magazines across every library in LibFind.",
      },
    ],
  }),
  component: GlobalSearch,
});

type Filter = "All" | ItemType;

function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const booksQuery = useQuery({ queryKey: ["books", "all"], queryFn: fetchAllBooks });

  const term = search.trim().toLowerCase();
  const books = (booksQuery.data ?? []).filter(
    (b) =>
      (filter === "All" || b.type === filter) &&
      (!availableOnly || b.available) &&
      (term === "" ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)),
  );

  return (
    <AppShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
            Global search
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold">
            Search every drawer at once
          </h1>
          <p className="mt-2 max-w-[52ch] text-sm text-muted-foreground">
            Look across all Delhi libraries in one go and see exactly which reading room
            holds the title — and whether it's on the shelf.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author…"
              aria-label="Search all libraries"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2">
              {(["All", "Book", "Magazine"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "rounded-lg bg-azure px-4 py-3 text-sm font-medium text-paper"
                      : "rounded-lg border border-input bg-background px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="size-4 accent-azure"
            />
            Available on the shelf only
          </label>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {booksQuery.data
                  ? `${books.length} of ${booksQuery.data.length} titles`
                  : ""}
              </span>
            </div>

            {booksQuery.isPending ? (
              <LoadingRows count={5} />
            ) : booksQuery.isError ? (
              <StateBlock
                tone="error"
                title="Couldn't load the catalogue"
                description="Something went wrong. Refresh to try again."
              />
            ) : books.length === 0 ? (
              <StateBlock
                title={term ? "No titles match" : "Nothing catalogued yet"}
                description={
                  term
                    ? "Try a different search term or widen your filters."
                    : "Add books from the Manage page."
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {books.map((book, i) => (
                  <li key={book.id}>
                    <Link
                      to="/book/$bookId"
                      params={{ bookId: book.id }}
                      className="flex items-center gap-4 py-4"
                    >
                      <span className="w-8 shrink-0 font-mono text-xs text-ochre-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg font-semibold tracking-tight">
                          {book.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {book.author} · {book.type}
                        </p>
                      </div>
                      {book.libraries ? (
                        <Link
                          to="/library/$libraryId"
                          params={{ libraryId: book.libraries.id }}
                          onClick={(e) => e.stopPropagation()}
                          className="hidden shrink-0 text-right text-sm text-azure-deep hover:underline sm:block"
                        >
                          {book.libraries.name}
                        </Link>
                      ) : null}
                      <span className="shrink-0">
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
