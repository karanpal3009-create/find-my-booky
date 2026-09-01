import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, LoadingRows, StateBlock } from "@/components/AppShell";
import { fetchLibraries, fetchLibraryCounts } from "@/lib/libfind";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Delhi libraries — LibFind" },
      { name: "description", content: "Browse the five Delhi libraries indexed in LibFind." },
      { property: "og:title", content: "Delhi libraries — LibFind" },
      { property: "og:description", content: "Browse the Delhi libraries indexed in LibFind." },
    ],
  }),
  component: Home,
});

function Home() {
  const librariesQuery = useQuery({ queryKey: ["libraries"], queryFn: fetchLibraries });
  const countsQuery = useQuery({ queryKey: ["library-counts"], queryFn: fetchLibraryCounts });

  return (
    <AppShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
                Home grid
              </p>
              <h1 className="mt-2 text-balance font-display text-3xl font-bold">
                Choose a Delhi library
              </h1>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {librariesQuery.data ? `${librariesQuery.data.length} locations` : ""}
            </span>
          </div>

          {librariesQuery.isPending ? (
            <LoadingRows count={3} />
          ) : librariesQuery.isError ? (
            <StateBlock
              tone="error"
              title="Couldn't load libraries"
              description="Check your connection and refresh the page."
            />
          ) : librariesQuery.data.length === 0 ? (
            <StateBlock title="No libraries yet" description="Nothing has been catalogued." />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {librariesQuery.data.map((library, i) => (
                <Link
                  key={library.id}
                  to="/library/$libraryId"
                  params={{ libraryId: library.id }}
                  className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-border transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-ochre-deep">
                      LIB · {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] text-azure-deep">
                      {countsQuery.data ? `${countsQuery.data[library.id] ?? 0} items` : "—"}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight">{library.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {library.address} · {library.city}
                    </p>
                  </div>
                  <div className="mt-auto pt-1 text-sm font-medium text-azure-deep">
                    Open the drawer →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
