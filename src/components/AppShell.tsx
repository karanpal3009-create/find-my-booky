import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/home" className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold tracking-tight">LibFind</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Card catalogue
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/home"
              className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "px-3 py-2 text-foreground font-medium" }}
            >
              Home
            </Link>
            <Link
              to="/manage"
              className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "px-3 py-2 text-foreground font-medium" }}
            >
              Manage
            </Link>
            <button
              onClick={handleSignOut}
              className="ml-1 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-ochre-deep"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row">
          <span className="font-display text-lg font-bold tracking-tight text-paper">LibFind</span>
          <span className="font-mono text-xs text-cream/50">
            A prototype. No reservations, no maps, no noise.
          </span>
        </div>
      </footer>
    </div>
  );
}

export function StatusPill({ available }: { available: boolean }) {
  return available ? (
    <span className="shrink-0 rounded-full bg-ochre/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ochre-deep ring-1 ring-ochre/30">
      Available
    </span>
  ) : (
    <span className="shrink-0 rounded-full bg-muted px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground ring-1 ring-border">
      Checked out
    </span>
  );
}

export function StateBlock({
  title,
  description,
  tone = "muted",
}: {
  title: string;
  description?: string;
  tone?: "muted" | "error";
}) {
  return (
    <div
      className={`rounded-xl border border-border p-8 text-center ${
        tone === "error" ? "bg-destructive/5" : "bg-card"
      }`}
      role={tone === "error" ? "alert" : undefined}
    >
      <p className="font-display text-lg font-semibold">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function LoadingRows({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
