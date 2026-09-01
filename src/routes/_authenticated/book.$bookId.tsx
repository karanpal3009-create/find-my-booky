import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, LoadingRows, StateBlock, StatusPill } from "@/components/AppShell";
import { fetchBook } from "@/lib/libfind";

export const Route = createFileRoute("/_authenticated/book/$bookId")({
  head: () => ({
    meta: [
      { title: "Title details — LibFind" },
      {
        name: "description",
        content: "See the author, type, availability and holding library for this title.",
      },
      { property: "og:title", content: "Title details — LibFind" },
      {
        property: "og:description",
        content: "Availability and holding library for this book or magazine.",
      },
    ],
  }),
  component: BookDetail,
});

function BookDetail() {
  const { bookId } = Route.useParams();
  const bookQuery = useQuery({ queryKey: ["book", bookId], queryFn: () => fetchBook(bookId) });

  return (
    <AppShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-5 py-14">
          <Link to="/home" className="font-mono text-xs text-azure-deep hover:underline">
            ← All libraries
          </Link>

          <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
            Title detail
          </p>

          <div className="mt-5">
            {bookQuery.isPending ? (
              <LoadingRows count={2} />
            ) : bookQuery.isError ? (
              <StateBlock
                tone="error"
                title="Couldn't load this title"
                description="Something went wrong. Refresh to try again."
              />
            ) : !bookQuery.data ? (
              <StateBlock
                title="Title not found"
                description="This entry may have been removed from the catalogue."
              />
            ) : (
              <article className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-azure-deep">
                    {bookQuery.data.type}
                  </span>
                  <StatusPill available={bookQuery.data.available} />
                </div>
                <h1 className="text-balance font-display text-3xl font-bold leading-tight">
                  {bookQuery.data.title}
                </h1>
                <p className="mt-2 text-base text-muted-foreground">{bookQuery.data.author}</p>

                <dl className="mt-6 grid grid-cols-2 gap-y-4 border-t border-border pt-5 text-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Held at
                  </dt>
                  <dd className="text-right font-medium">
                    {bookQuery.data.libraries ? (
                      <Link
                        to="/library/$libraryId"
                        params={{ libraryId: bookQuery.data.libraries.id }}
                        className="text-azure-deep hover:underline"
                      >
                        {bookQuery.data.libraries.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Address
                  </dt>
                  <dd className="text-right font-medium">
                    {bookQuery.data.libraries
                      ? `${bookQuery.data.libraries.address}, ${bookQuery.data.libraries.city}`
                      : "—"}
                  </dd>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Type
                  </dt>
                  <dd className="text-right font-medium">{bookQuery.data.type}</dd>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </dt>
                  <dd className="text-right font-medium">
                    {bookQuery.data.available ? "On the shelf" : "Checked out"}
                  </dd>
                </dl>
              </article>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
