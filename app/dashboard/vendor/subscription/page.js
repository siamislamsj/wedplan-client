"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { ConfirmButton, DataState, PageHeader } from "@/components/common";
import { Badge, Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyBoth } from "@/lib/utils";

const PLANS = [
  { id: "free", name: "Free", amount: 0, features: ["Maximum 3 active services", "Basic vendor dashboard", "Booking request management"] },
  { id: "premium", name: "Premium", amount: 19.99, features: ["Unlimited active services", "Premium Vendor badge", "All Free plan features"] },
];

export default function Subscription() {
  const { data: s, loading, error, reload } = useApi("/vendor/stats");
  const [busy, setBusy] = useState(false);

  async function upgrade() {
    setBusy(true);
    try { const { url } = await api("/payments/checkout", { method: "POST" }); window.location.href = url; }
    catch (e) { toast.error(e.message); setBusy(false); }
  }
  async function cancel() {
    try { const r = await api("/payments/cancel", { method: "POST" }); toast.success(r.message); reload(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="Subscription" text="Premium is activated only after Stripe confirms your payment. BDT prices are indicative; checkout is charged in USD." />
      <DataState loading={loading} error={error} reload={reload}>
        {s && (
          <div className="grid max-w-4xl gap-5 md:grid-cols-2">
            {PLANS.map((p) => {
              const current = s.plan === p.id;
              return (
                <Card key={p.id} className={current ? "border-primary" : ""}>
                  <CardBody className="grid gap-4">
                    <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-2xl font-semibold">{p.id === "premium" && <Crown className="size-5 text-gold" />}{p.name}</h2>{current && <Badge status="approved">Current plan</Badge>}</div>
                    <div><p className="font-serif text-3xl font-semibold text-primary">{moneyBoth(p.amount)}{p.id === "premium" ? "/mo" : ""}</p></div>
                    <ul className="grid gap-2 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 text-sage mt-0.5" />{f}</li>)}</ul>
                    {p.id === "free" && s.plan === "free" && <p className="text-sm text-muted">{s.activeCount} of {s.limit} active services used.</p>}
                    {p.id === "premium" && (s.plan === "premium" ? (
                      <div className="grid gap-2 text-sm">
                        <p className="text-muted">{s.cancelAtPeriodEnd ? "Ends" : "Renews"} on {fdate(s.subscriptionExpiresAt)}</p>
                        {!s.cancelAtPeriodEnd && <ConfirmButton onConfirm={cancel} confirmLabel="Cancel plan?" size="md">Cancel subscription</ConfirmButton>}
                      </div>
                    ) : <Button variant="gold" loading={busy} onClick={upgrade}>Upgrade to Premium</Button>)}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </DataState>
    </>
  );
}
