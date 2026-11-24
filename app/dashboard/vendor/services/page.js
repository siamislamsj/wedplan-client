"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { ConfirmButton, DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyBoth } from "@/lib/utils";

export default function MyServices() {
  const { data, loading, error, reload } = useApi("/vendor/services");

  async function toggle(s) {
    try { const r = await api(`/vendor/services/${s._id}`, { method: "PATCH", body: { isActive: !s.isActive } }); toast.success(r.message); reload(); }
    catch (e) { toast.error(e.message); }
  }
  async function remove(s) {
    try { const r = await api(`/vendor/services/${s._id}`, { method: "DELETE" }); toast.success(r.message); reload(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="My services" text="Edited services are re-reviewed by an admin before going live again.">
        <Link href="/dashboard/vendor/add-service"><Button>Add service</Button></Link>
      </PageHeader>
      <DataState loading={loading} error={error} reload={reload} empty={data?.length === 0}
        emptyProps={{ title: "You haven’t added a service yet", text: "Add your first service to start receiving booking requests.", action: <Link href="/dashboard/vendor/add-service"><Button>Add service</Button></Link> }}>
        <div className="grid gap-4">
          {data?.map((s) => (
            <Card key={s._id} className="flex flex-col gap-4 p-4 sm:flex-row">
              <img src={s.images?.[0]} alt="" className="h-32 w-full rounded-md object-cover sm:w-44" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{s.serviceName}</h2>
                  <Badge status={s.status} />
                  <Badge status={s.isActive ? "approved" : "cancelled"}>{s.isActive ? "Available" : "Paused"}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{s.category} · {s.location} · {s.offerPrice ? `${moneyBoth(s.offerPrice)} (offer, regular ${moneyBoth(s.price)})` : moneyBoth(s.price)} · Added {fdate(s.createdAt)}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/80">{s.description}</p>
                {s.status === "rejected" && <p className="mt-2 text-sm text-red-700">Rejected by admin. It is hidden from customers. Edit and resubmit to request another review.</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggle(s)}>{s.isActive ? "Pause" : "Make available"}</Button>
                  <Link href={`/dashboard/vendor/services/${s._id}`}><Button size="sm" variant="outline"><Pencil className="size-3.5" />Edit</Button></Link>
                  <ConfirmButton onConfirm={() => remove(s)} confirmLabel="Delete?">Delete</ConfirmButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DataState>
    </>
  );
}
