import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";

type PlanInfo = { name: string; price: number; catalogues: string };

const PLANS: Record<string, PlanInfo | undefined> = {
  reader: { name: "Reader", price: 100, catalogues: "5 library catalogues" },
  scholar: { name: "Scholar", price: 250, catalogues: "20 library catalogues" },
  archivist: { name: "Archivist", price: 500, catalogues: "100+ catalogues, Delhi & beyond" },
};

const DEFAULT_PLAN: PlanInfo = {
  name: "Scholar",
  price: 250,
  catalogues: "20 library catalogues",
};

export const Route = createFileRoute("/_authenticated/checkout")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search["plan"];
    return { plan: typeof raw === "string" && PLANS[raw] ? raw : "scholar" };
  },

  head: () => ({
    meta: [
      { title: "Checkout — LibFind" },
      {
        name: "description",
        content:
          "Complete your LibFind membership payment with Google Pay, Paytm, UPI, credit card or debit card.",
      },
      { property: "og:title", content: "Checkout — LibFind" },
      {
        property: "og:description",
        content: "Pay for your LibFind plan with Google Pay, Paytm, UPI or cards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

type Method = "gpay" | "paytm" | "upi" | "credit" | "debit";

const METHODS: { id: Method; label: string; hint: string; glyph: string }[] = [
  { id: "gpay", label: "Google Pay", hint: "Pay instantly via UPI app", glyph: "G" },
  { id: "paytm", label: "Paytm", hint: "Wallet or linked bank account", glyph: "P" },
  { id: "upi", label: "Other UPI", hint: "PhonePe, BHIM, Amazon Pay", glyph: "◎" },
  { id: "credit", label: "Credit card", hint: "Visa, Mastercard, RuPay, Amex", glyph: "▤" },
  { id: "debit", label: "Debit card", hint: "All Indian bank debit cards", glyph: "▥" },
];

function Checkout() {
  const { plan: planId } = Route.useSearch();
  const navigate = useNavigate();
  const plan = PLANS[planId] ?? PLANS.scholar;

  const [method, setMethod] = useState<Method>("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const isCard = method === "credit" || method === "debit";
  const gst = Math.round(plan.price * 0.18);
  const total = plan.price + gst;

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (isCard && (cardNumber.replace(/\s/g, "").length < 12 || !cardName || !expiry || !cvv)) {
      toast.error("Please fill in all card details.");
      return;
    }
    if (method === "upi" && !upiId.includes("@")) {
      toast.error("Enter a valid UPI ID, e.g. name@bank.");
      return;
    }
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setDone(true);
      toast.success(`Payment of ₹${total} received — ${plan.name} membership active.`);
    }, 1400);
  }

  if (done) {
    return (
      <AppShell>
        <section className="bg-cream">
          <div className="mx-auto max-w-xl px-5 py-20 text-center">
            <div className="rounded-2xl bg-card p-10 ring-1 ring-border">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ochre/15 font-display text-2xl text-ochre-deep">
                ✓
              </span>
              <h1 className="mt-5 font-display text-3xl font-bold">Payment successful</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Your <strong>{plan.name}</strong> membership is active — ₹{total} paid (incl. ₹{gst}{" "}
                GST). {plan.catalogues} are now open to you.
              </p>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                Demo checkout — no real money was charged.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/home"
                  className="rounded-lg bg-ochre px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ochre-deep"
                >
                  Back to libraries
                </Link>
                <Link
                  to="/search"
                  className="rounded-lg bg-azure px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-azure-deep"
                >
                  Search the catalogue
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-ochre">Checkout</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Complete your payment
          </h1>
          <p className="mt-3 max-w-xl text-sm text-paper/70">
            Choose how you'd like to pay. Monthly billing, cancel anytime.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Payment methods */}
          <form onSubmit={handlePay} className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-display text-xl font-bold">Payment options</h2>

            <div className="mt-5 space-y-3">
              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 ring-1 transition-colors ${
                    method === m.id ? "bg-ochre/10 ring-2 ring-ochre" : "bg-background ring-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="sr-only"
                  />
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-azure/10 font-display text-sm font-bold text-azure-deep">
                    {m.glyph}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.hint}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full ring-1 ${
                      method === m.id ? "bg-ochre ring-ochre" : "ring-border"
                    }`}
                  />
                </label>
              ))}
            </div>

            {/* Method-specific fields */}
            <div className="mt-6 space-y-4">
              {method === "gpay" || method === "paytm" ? (
                <div className="rounded-xl bg-azure/5 p-4 text-sm text-muted-foreground ring-1 ring-azure/20">
                  You'll be redirected to {method === "gpay" ? "Google Pay" : "Paytm"} to approve a
                  ₹{total} payment request.
                </div>
              ) : null}

              {method === "upi" ? (
                <div>
                  <label htmlFor="upi" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    UPI ID
                  </label>
                  <input
                    id="upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bank"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ochre"
                  />
                </div>
              ) : null}

              {isCard ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="cardnum" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Card number
                    </label>
                    <input
                      id="cardnum"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ochre"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="cardname" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Name on card
                    </label>
                    <input
                      id="cardname"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As printed on the card"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ochre"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Expiry
                    </label>
                    <input
                      id="exp"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ochre"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ochre"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={paying}
              className="mt-7 w-full rounded-lg bg-ochre px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-ochre-deep disabled:opacity-60"
            >
              {paying ? "Processing…" : `Pay ₹${total}`}
            </button>
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
              Demo checkout — no real payment is taken.
            </p>
          </form>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-azure-deep">
              {plan.name} plan
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.catalogues}</p>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Plan (monthly)</dt>
                <dd className="tabular-nums">₹{plan.price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GST (18%)</dt>
                <dd className="tabular-nums">₹{gst}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">₹{total}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigate({ to: "/subscription" })}
              className="mt-6 w-full rounded-lg bg-background px-4 py-2.5 text-sm font-medium ring-1 ring-border transition-colors hover:bg-muted"
            >
              Change plan
            </button>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
