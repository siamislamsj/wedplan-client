"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";
import { moneyDualFromCurrency } from "@/lib/utils";


export default function SuccessClient() {
  const id = useSearchParams().get("session_id");
  const [tx, setTx] = useState(null);
  const [err, setErr] = useState(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!id) { setErr("Missing payment session."); return; }
    let stop = false;
    (async () => {
      try {
        const t = await api(`/payments/session/${id}`);
        if (stop) return;
        setTx(t);
        if (t.status === "pending" && tries < 15) setTimeout(() => !stop && setTries((n) => n + 1), 2000);
      } catch (e) { setErr(e.message); }
    })();
    return () => { stop = true; };
  }, [id, tries]);

  const paid = tx?.status === "paid";
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      {err ? <><XCircle className="mx-auto size-14 text-red-600" /><h1 className="mt-4 text-3xl font-semibold">We couldn’t verify this payment</h1><p className="mt-2 text-muted">{err}</p></>
      : !tx ? <Spinner label="Checking your payment…" />
      : paid ? <><CheckCircle2 className="mx-auto size-14 text-sage" /><h1 className="mt-4 text-3xl font-semibold">{tx.kind === "wedding_service" ? "Wedding payment confirmed" : "Welcome to Premium"}</h1><p className="mt-2 text-muted">Payment of {moneyDualFromCurrency(tx.amount, tx.currency)} confirmed. {tx.kind === "wedding_service" ? "This is a one-time event payment. Contact the vendor to finalize your event arrangements." : "You can now publish unlimited services."}</p></>
      : tx.status === "pending" ? <><Clock className="mx-auto size-14 text-gold" /><h1 className="mt-4 text-3xl font-semibold">Confirming your payment…</h1><p className="mt-2 text-muted">{tries < 15 ? "Waiting for Stripe’s confirmation. This usually takes a few seconds." : "Still waiting. Premium activates automatically once Stripe confirms; check your Subscription page shortly."}</p></>
      : <><XCircle className="mx-auto size-14 text-red-600" /><h1 className="mt-4 text-3xl font-semibold">Payment {tx.status}</h1><p className="mt-2 text-muted">No charge was made. You can try again from the Subscription page.</p></>}
      <Link href={tx?.kind === "wedding_service" ? "/browse-services" : "/dashboard/vendor/subscription"}><Button className="mt-8">{tx?.kind === "wedding_service" ? "Browse wedding services" : "Go to Subscription"}</Button></Link>
    </div>
  );
}
