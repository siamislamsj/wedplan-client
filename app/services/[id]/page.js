"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crown, MapPin, Tag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";
import { Avatar } from "@/components/Navbar";
import { DataState } from "@/components/common";
import { moneyBoth } from "@/lib/utils";

export default function ServiceDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: s, loading, error, reload } = useApi(`/services/${id}`);
  const [img, setImg] = useState(0);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const role = session?.user?.role;
  const own = s && String(s.vendorId) === String(session?.user?.id);
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

  async function book(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await api("/bookings", { method: "POST", body: { serviceId: id, eventDate: fd.get("eventDate"), eventLocation: fd.get("eventLocation"), message: fd.get("message") } });
      toast.success("Booking request sent to the vendor");
      router.push("/dashboard/customer/bookings");
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  }

  async function payNow() {
    setPaying(true);
    try {
      const result = await api("/payments/service-checkout", { method: "POST", body: { serviceId: id } });
      if (!result.url) throw new Error("Checkout link unavailable");
      window.location.assign(result.url);
    } catch (err) { toast.error(err.message); setPaying(false); }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <DataState loading={loading} error={error && (error.includes("not") || error.includes("Invalid") ? "This service doesn’t exist or is no longer available." : error)} reload={reload}>
        {s && (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-blush"><img src={s.images?.[img]} alt={s.serviceName} className="size-full object-cover" /></div>
              {s.images?.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {s.images.map((u, i) => (
                    <button key={u} onClick={() => setImg(i)} className={`size-20 shrink-0 overflow-hidden rounded-md border-2 cursor-pointer ${i === img ? "border-primary" : "border-transparent"}`}><img src={u} alt="" className="size-full object-cover" /></button>
                  ))}
                </div>
              )}
              <h1 className="mt-6 text-4xl font-semibold">{s.serviceName}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                <span className="flex items-center gap-1"><Tag className="size-4" />{s.category}</span>
                <span className="flex items-center gap-1"><MapPin className="size-4" />{s.location}</span>
              </div>
              <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/85">{s.description}</p>
            </div>

            <aside className="grid content-start gap-5 lg:col-span-2">
              <Card><CardBody>
                <p className="text-sm text-muted">One-time event package starting price (not monthly)</p>
                <div className="flex flex-wrap items-baseline gap-3">{s.offerPrice && s.offerPrice < s.price ? <><p className="font-serif text-2xl font-semibold text-primary">{moneyBoth(s.offerPrice)}</p><p className="text-sm text-muted line-through">{moneyBoth(s.price)}</p><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Special offer</span></> : <p className="font-serif text-2xl font-semibold text-primary">{moneyBoth(s.price)}</p>}</div>
                {role === "customer" && s.bookable && <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button onClick={payNow} loading={paying}>Pay Now</Button>
                  <a href="#contact-vendor" className="flex items-center justify-center rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary">Contact Us</a>
                </div>}
                {!session && <Link href="/sign-in" className="mt-4 inline-block text-sm text-primary underline">Sign in to pay or contact the vendor</Link>}
                <p className="mt-2 text-xs text-muted">Payment is one time per event. Contact the vendor for a custom quote before paying.</p>
                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <Avatar user={s.vendor} size={11} />
                  <div><p className="flex items-center gap-1 font-medium">{s.vendor?.businessName || s.vendor?.name}{s.vendor?.isPremium && <Crown className="size-4 text-gold" aria-label="Premium vendor" />}</p>{s.vendor?.businessName && <p className="text-xs text-muted">{s.vendor.name}</p>}</div>
                </div>
              </CardBody></Card>

              <Card><CardBody>
                <h2 id="contact-vendor" className="text-2xl font-semibold">Contact Us / Request a booking</h2>
                {!s.bookable ? <p className="mt-2 text-sm text-muted">This service is not currently open for booking.</p>
                : role === "customer" ? (
                  <form onSubmit={book} className="mt-4 grid gap-4">
                    <Field label="Event date" htmlFor="eventDate"><Input id="eventDate" name="eventDate" type="date" min={tomorrow} required /></Field>
                    <Field label="Event location" htmlFor="eventLocation"><Input id="eventLocation" name="eventLocation" required placeholder="Venue or city" /></Field>
                    <Field label="Additional message" htmlFor="message"><Textarea id="message" name="message" maxLength={1000} placeholder="Guest count, style, special requests…" /></Field>
                    <Button type="submit" loading={saving}>Send booking request</Button>
                  </form>
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    {own ? "This is your own service, so you can’t book it." : role === "vendor" ? "Vendor accounts can’t book services. Use a customer account to send requests." : "Admin accounts can’t submit booking requests."}
                    {own && <> <Link href="/dashboard/vendor/services" className="text-primary underline">Manage it</Link></>}
                  </p>
                )}
              </CardBody></Card>
            </aside>
          </div>
        )}
      </DataState>
    </div>
  );
}
