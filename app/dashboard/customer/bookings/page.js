"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { ConfirmButton, DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyBoth } from "@/lib/utils";

export default function MyBookings() {
  const { data, loading, error, reload } = useApi("/bookings/mine");
  const [open, setOpen] = useState(null);

  async function cancel(b) {
    try { const r = await api(`/bookings/${b._id}/cancel`, { method: "PATCH" }); toast.success(r.message); }
    catch (e) { toast.error(e.message); } finally { reload(); }
  }

  return (
    <>
      <PageHeader title="My bookings" text="You can cancel a request while it is still pending." />
      <DataState loading={loading} error={error} reload={reload} empty={data?.items?.length === 0}
        emptyProps={{ title: "No booking requests yet", text: "Find a service you like and send your first request.", action: <Link href="/browse-services"><Button>Browse services</Button></Link> }}>
        <div className="grid gap-4">
          {data?.items?.map((b) => (
            <Card key={b._id} className="flex flex-col gap-4 p-4 sm:flex-row">
              <img src={b.service?.images?.[0]} alt="" className="h-28 w-full rounded-md bg-blush object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold">{b.service?.serviceName || "Service removed"}</h2><Badge status={b.status} /></div>
                <p className="mt-1 text-sm text-muted">Vendor: {b.vendor?.businessName || b.vendor?.name} · Event {fdate(b.eventDate)} · {b.eventLocation} · Requested {fdate(b.createdAt)}</p>
                {open === b._id && (
                  <div className="mt-3 grid gap-1 rounded-md bg-blush/50 p-3 text-sm">
                    <p><span className="text-muted">Price: </span>{moneyBoth(b.service?.price)}</p>
                    <p><span className="text-muted">Vendor email: </span>{b.vendor?.email}</p>
                    <p><span className="text-muted">Your message: </span>{b.message || "No message"}</p>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setOpen(open === b._id ? null : b._id)}>{open === b._id ? "Hide details" : "View details"}</Button>
                  {b.status === "pending" && <ConfirmButton onConfirm={() => cancel(b)} confirmLabel="Cancel request?">Cancel request</ConfirmButton>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DataState>
    </>
  );
}
