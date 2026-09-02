import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription plans — LibFind" },
      {
        name: "description",
        content:
          "Pick a LibFind plan: ₹100/month for 5 library catalogues, ₹250/month for 20, or ₹500/month for 100+ across Delhi and other states.",
      },
      { property: "og:title", content: "Subscription plans — LibFind" },
      {
        property: "og:description",
        content: "Reader plans from ₹100/month for access to library catalogues across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Subscription,
});

type Plan = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  catalogues: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "reader",
    name: "Reader",
    price: 100,
    tagline: "For the neighbourhood regular",
    catalogues: "5 library catalogues",
    features: [
      "Browse 5 Delhi library catalogues",
      "Live availability on every title",
      "Search titles and authors",
      "Directions to each library",
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    price: 250,
    tagline: "For students and researchers",
    catalogues: "20 library catalogues",
    features: [
      "Everything in Reader",
      "Browse 20 library catalogues",
      "Magazines and periodicals included",
      "Priority search across all 20 drawers",
    ],
    featured: true,
  },
  {
    id: "archivist",
    name: "Archivist",
    price: 500,
    tagline: "For the serious collector",
    catalogues: "100+ catalogues, Delhi & beyond",
    features: [
      "Everything in Scholar",
      "100+ libraries across Delhi and other states",
      "Statewide cross-library search",
      "Early access to newly indexed libraries",
    ],
  },
];

function Subscription() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <AppShell>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-ochre">Subscription</p>
          <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl font-bold leading-[1.08] sm:text-5xl">
            Open more drawers, month by month
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-paper/70 sm:text-base">
            Every plan is billed monthly in rupees and can be cancelled anytime. Start small with
            your local branch, or unlock catalogues across the country.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl p-6 ring-1 transition-transform duration-200 hover:-translate-y-1 ${
                  plan.featured
                    ? "bg-card ring-2 ring-ochre shadow-lg"
                    : "bg-card ring-border"
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ochre via-ochre-deep to-azure opacity-70" />
                {plan.featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-ochre px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
                    Most picked
                  </span>
                ) : null}

                <p className="pt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-azure-deep">
                  {plan.name}
                </p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tabular-nums">
                    ₹{plan.price}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">/month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

                <p className="mt-4 rounded-lg bg-azure/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-azure-deep">
                  {plan.catalogues}
                </p>

                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden="true" className="text-ochre-deep">
                        ✓
                      </span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/checkout"
                  search={{ plan: plan.id }}
                  onClick={() => setSelected(plan.id)}
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    plan.featured
                      ? "bg-ochre text-paper hover:bg-ochre-deep"
                      : "bg-azure text-paper hover:bg-azure-deep"
                  }`}
                >
                  {selected === plan.id ? "Selected ✓" : `Choose ${plan.name}`}
                </Link>

              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-display text-xl font-bold">What's included in every plan</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Live shelf status", "See what's available before you travel."],
                ["Maps built in", "One tap for directions to any branch."],
                ["Cancel anytime", "Monthly billing, no lock-in period."],
              ].map(([title, body]) => (
                <div key={title}>
                  <p className="font-display font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-[11px] text-muted-foreground">
              Prototype pricing page — no payment is taken.{" "}
              <Link to="/search" className="text-azure-deep hover:underline">
                Browse the catalogue instead →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
