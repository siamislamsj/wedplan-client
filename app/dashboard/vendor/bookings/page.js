"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate } from "@/lib/utils";

export default function VendorBookings() {
  const { data, loading, error, reload } = useApi("/bookings/vendor");
  const [busy, setBusy] = useState(null);

  async function act(b, status) {
    setBusy(b._id + status);
    try { const r = await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status } }); toast.success(r.message); }
    catch (e) { toast.error(e.message); } finally { setBusy(null); reload(); }
  }

  return (
    <>
      <PageHeader title="Booking requests" text="Only pending requests can be accepted or rejected, and the decision is final." />
      <DataState loading={loading} error={error} reload={reload} empty={data?.length === 0} emptyProps={{ title: "No booking requests yet", text: "Requests appear here when customers book your services." }}>
        <div className="grid gap-4">
          {data?.map((b) => (
            <Card key={b._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-xl font-semibold">{b.service?.serviceName || "Deleted service"}</h2><p className="text-sm text-muted">Requested {fdate(b.createdAt)}</p></div>
                <Badge status={b.status} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-muted">Customer</dt><dd className="font-medium">{b.customer?.name}</dd><dd className="text-muted">{b.customer?.email}</dd></div>
                <div><dt className="text-muted">Event date</dt><dd className="font-medium">{fdate(b.eventDate)}</dd></div>
                <div><dt className="text-muted">Event location</dt><dd className="font-medium">{b.eventLocation}</dd></div>
              </dl>
              {b.message && <p className="mt-3 rounded-md bg-blush/50 p-3 text-sm"><span className="text-muted">Message: </span>{b.message}</p>}
              {b.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="sage" loading={busy === b._id + "accepted"} disabled={!!busy} onClick={() => act(b, "accepted")}>Accept</Button>
                  <Button size="sm" variant="outline" loading={busy === b._id + "rejected"} disabled={!!busy} onClick={() => act(b, "rejected")}>Reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </DataState>
    </>
  );
}
