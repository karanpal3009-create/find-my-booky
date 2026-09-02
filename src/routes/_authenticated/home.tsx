import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, LoadingRows, StateBlock } from "@/components/AppShell";
import { fetchLibraries, fetchLibraryCounts, fetchBookStats } from "@/lib/libfind";

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

// Decorative book-spine shelf. Pure CSS, no images. Colors drawn from the
// design tokens so the motif stays on-brand in any theme.
const SPINES = [
  { c: "bg-ochre", w: "w-9", h: "h-28" },
  { c: "bg-azure", w: "w-7", h: "h-36" },
  { c: "bg-paper", w: "w-10", h: "h-24" },
  { c: "bg-ochre-deep", w: "w-6", h: "h-32" },
  { c: "bg-azure-deep", w: "w-9", h: "h-40" },
  { c: "bg-cream", w: "w-7", h: "h-28" },
  { c: "bg-ochre", w: "w-8", h: "h-34" },
  { c: "bg-azure", w: "w-6", h: "h-30" },
  { c: "bg-paper", w: "w-10", h: "h-26" },
];

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "ochre" | "azure" | "paper";
}) {
  const tone =
    accent === "ochre"
      ? "text-ochre"
      : accent === "azure"
        ? "text-azure"
        : "text-paper";
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
        {label}
      </span>
      <span className={`mt-1 font-display text-3xl font-bold tabular-nums ${tone}`}>
        {value}
      </span>
    </div>
  );
}

function Home() {
  const librariesQuery = useQuery({ queryKey: ["libraries"], queryFn: fetchLibraries });
  const countsQuery = useQuery({ queryKey: ["library-counts"], queryFn: fetchLibraryCounts });
  const statsQuery = useQuery({ queryKey: ["book-stats"], queryFn: fetchBookStats });

  const totalItems = countsQuery.data
    ? Object.values(countsQuery.data).reduce((a, b) => a + b, 0)
    : null;

  return (
    <AppShell>
      {/* Hero — dark "ink" band with a book-spine shelf motif */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-ochre">
                Card catalogue
              </p>
              <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
                Find your next read across Delhi's libraries
              </h1>
              <p className="mt-4 max-w-md text-sm text-paper/70 sm:text-base">
                One index for five public libraries. See what's on the shelf
                right now — books, magazines, and the drawer each lives in.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/search"
                  className="rounded-lg bg-azure px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-azure-deep"
                >
                  Search the stacks
                </Link>
                <a
                  href="#libraries"
                  className="rounded-lg border border-paper/25 px-5 py-2.5 text-sm font-medium text-paper/80 transition-colors hover:bg-paper/5 hover:text-paper"
                >
                  Browse libraries
                </a>
              </div>
            </div>

            {/* Book-spine shelf */}
            <div className="relative" aria-hidden="true">
              <div className="flex items-end justify-center gap-1.5 sm:gap-2">
                {SPINES.map((s, i) => (
                  <div
                    key={i}
                    className={`${s.c} ${s.w} ${s.h} flex flex-col justify-end rounded-t-sm pb-2 shadow-[0_-2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10`}
                  >
                    <span className="mx-auto mb-1 h-px w-3/4 bg-current opacity-30" />
                    <span className="mx-auto h-px w-1/2 bg-current opacity-30" />
                  </div>
                ))}
              </div>
              {/* shelf board */}
              <div className="mt-1 h-2 w-full rounded-sm bg-paper/15" />
              <div className="mx-auto h-3 w-[92%] rounded-b-sm bg-black/25" />
            </div>
          </div>

          {/* Stats ribbon */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-paper/15 pt-6">
            <Stat
              label="Libraries"
              value={librariesQuery.data ? librariesQuery.data.length : "—"}
              accent="ochre"
            />
            <Stat
              label="Titles indexed"
              value={totalItems ?? "—"}
              accent="azure"
            />
            <Stat
              label="On the shelf now"
              value={statsQuery.data ? statsQuery.data.available : "—"}
              accent="paper"
            />
          </div>
        </div>
      </section>

      {/* Library grid */}
      <section id="libraries" className="bg-cream scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
                Home grid
              </p>
              <h2 className="mt-2 text-balance font-display text-3xl font-bold">
                Choose a Delhi library
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/search"
                className="rounded-lg bg-azure px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-azure-deep"
              >
                Search all
              </Link>
              <span className="font-mono text-xs text-muted-foreground">
                {librariesQuery.data ? `${librariesQuery.data.length} locations` : ""}
              </span>
            </div>
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
              {librariesQuery.data.map((library, i) => {
                const count = countsQuery.data ? countsQuery.data[library.id] ?? 0 : null;
                return (
                  <Link
                    key={library.id}
                    to="/library/$libraryId"
                    params={{ libraryId: library.id }}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-border transition-transform duration-200 hover:-translate-y-1"
                  >
                    {/* catalogue-card top accent */}
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ochre via-ochre-deep to-azure opacity-70" />
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[11px] text-ochre-deep">
                        LIB · {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[11px] text-azure-deep">
                        {count !== null ? `${count} items` : "—"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">
                        {library.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {library.address} · {library.city}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-sm font-medium text-azure-deep">
                        Open the drawer →
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100">
                        {library.city}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
