import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LibFind — Find libraries across Delhi and what's on the shelf" },
      {
        name: "description",
        content:
          "LibFind lists libraries across Delhi and the books and magazines each one holds, with live availability.",
      },
      {
        property: "og:title",
        content: "LibFind — Find libraries across Delhi and what's on the shelf",
      },
      {
        property: "og:description",
        content: "Browse Delhi libraries and check which books and magazines are available.",
      },

    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold tracking-tight">LibFind</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Card catalogue
            </span>
          </span>
          <Link
            to="/auth"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-ochre-deep"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-azure">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.28em] text-cream/70">
            Delhi's reading rooms, catalogued
          </p>
          <h1 className="animate-rise mt-5 max-w-[16ch] text-balance font-display text-5xl font-extrabold leading-[0.95] text-paper sm:text-7xl">
            Every book, filed exactly where it belongs.
          </h1>
          <p className="animate-rise mt-6 max-w-[48ch] text-pretty text-lg text-cream/85">
            Pull open a Delhi library, read the card, and see which titles are waiting on the shelf
            — no noise, no clutter.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-6 py-3 font-display font-semibold text-primary-foreground ring-1 ring-black/5 transition-colors hover:bg-ochre-deep"
            >
              Sign in to start
            </Link>
            <Link
              to="/home"
              className="rounded-lg bg-paper px-6 py-3 font-display font-semibold text-ink ring-1 ring-black/5 transition-colors hover:bg-cream"
            >
              Browse the home grid
            </Link>
            <span className="ml-1 font-mono text-xs text-cream/60">5 Delhi libraries</span>
          </div>
        </div>
        <div className="h-2 bg-ochre" />
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
            How it works
          </p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold">
            Three steps to the shelf
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              ["01", "Choose a library", "Five reading rooms across Delhi, each with its own drawer of cards."],
              ["02", "Search the drawer", "Filter by book or magazine, or search titles and authors."],
              ["03", "Read the card", "See availability and exactly which library holds the title."],
            ].map(([n, title, body]) => (
              <div key={n} className="rounded-xl bg-card p-5 ring-1 ring-border">
                <span className="font-mono text-[11px] text-ochre-deep">{n}</span>
                <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 sm:flex-row">
          <span className="font-display text-lg font-bold tracking-tight text-paper">LibFind</span>
          <span className="font-mono text-xs text-cream/50">
            A prototype. No reservations, no maps, no noise.
          </span>
        </div>
      </footer>
    </div>
  );
}
