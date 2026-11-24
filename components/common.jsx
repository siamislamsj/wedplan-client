"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, SearchX, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { moneyBoth } from "@/lib/utils";

export const Spinner = ({ label = "Loading…" }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-muted" role="status"><Loader2 className="size-5 animate-spin" />{label}</div>
);
export const PageLoader = () => <div className="grid min-h-[60vh] place-items-center"><Spinner /></div>;

export const EmptyState = ({ title = "Nothing here yet", text, action }) => (
  <div className="grid place-items-center gap-2 rounded-lg border border-dashed border-line bg-white px-4 py-14 text-center">
    <SearchX className="size-8 text-muted" />
    <p className="font-serif text-xl font-semibold">{title}</p>
    {text && <p className="max-w-md text-sm text-muted">{text}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center">
    <p className="font-medium text-red-800">{message || "Something went wrong"}</p>
    {onRetry && <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>Retry</Button>}
  </div>
);

export function DataState({ loading, error, empty, emptyProps, reload, children }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (empty) return <EmptyState {...emptyProps} />;
  return children;
}

export const PageHeader = ({ title, text, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-3xl font-semibold">{title}</h1>{text && <p className="mt-1 text-sm text-muted">{text}</p>}</div>
    {children}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, tone = "text-primary" }) => (
  <Card className="flex items-center gap-4 p-5">
    {Icon && <span className="grid size-11 place-items-center rounded-full bg-blush"><Icon className={`size-5 ${tone}`} /></span>}
    <div><p className="text-2xl font-semibold leading-none">{value ?? "Not available"}</p><p className="mt-1 text-sm text-muted">{label}</p></div>
  </Card>
);


export function ConfirmButton({ onConfirm, children, confirmLabel = "Sure?", variant = "outline", size = "sm", ...p }) {
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!ask) return <Button variant={variant} size={size} onClick={() => setAsk(true)} {...p}>{children}</Button>;
  return (
    <span className="inline-flex gap-1">
      <Button variant="danger" size={size} loading={busy} onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); setAsk(false); } }}>{confirmLabel}</Button>
      <Button variant="ghost" size={size} onClick={() => setAsk(false)}>No</Button>
    </span>
  );
}

export const Reveal = ({ children, delay = 0, className }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

export function ServiceCard({ s }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/services/${s._id}`} className="relative block aspect-[4/5] overflow-hidden bg-blush">
        <img src={s.images?.[0]} alt={s.serviceName} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {s.offerPrice && s.offerPrice < s.price && (
          <span className="absolute right-3 top-3 bg-rose-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">Special offer</span>
        )}
        {s.vendor?.isPremium && (
          <span className="absolute left-3 top-3 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold"><Crown className="size-3" />Premium</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">{s.category}</p>
        <h3 className="mt-1 text-2xl leading-snug">{s.serviceName}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5 shrink-0" /><span className="truncate">{s.location} · {s.vendor?.businessName || s.vendor?.name}</span></p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div className="flex flex-col items-start gap-1">{s.offerPrice && s.offerPrice < s.price ? <><p className="font-serif text-lg text-primary">{moneyBoth(s.offerPrice)}</p><p className="text-xs text-muted line-through">{moneyBoth(s.price)}</p></> : <p className="font-serif text-lg text-primary">{moneyBoth(s.price)}</p>}</div>
          <Link href={`/services/${s._id}`}><Button size="sm">View Details</Button></Link>
        </div>
      </div>
    </article>
  );
}
