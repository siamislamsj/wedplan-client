"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi, useDebounced } from "@/hooks/useApi";
import { ConfirmButton, DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { CATEGORIES, moneyBoth } from "@/lib/utils";

export default function ManageServices() {
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [category, setCategory] = useState("");
  const dq = useDebounced(q);
  const { data, loading, error, reload } = useApi(`/admin/services?${new URLSearchParams({ ...(dq && { q: dq }), ...(status && { status }), ...(category && { category }) })}`);

  async function setS(s, status) {
    try { const r = await api(`/admin/services/${s._id}/status`, { method: "PATCH", body: { status } }); toast.success(r.message); reload(); } catch (e) { toast.error(e.message); }
  }
  async function del(s) {
    try { const r = await api(`/admin/services/${s._id}`, { method: "DELETE" }); toast.success(r.message); reload(); } catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="Manage services" text="Only approved and available services appear on the public Browse page." />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input placeholder="Search by service name" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search services" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
      </div>
      <DataState loading={loading} error={error} reload={reload} empty={data?.length === 0} emptyProps={{ title: "No services found" }}>
        <div className="grid gap-4">
          {data?.map((s) => (
            <Card key={s._id} className="flex flex-col gap-4 p-4 sm:flex-row">
              <img src={s.images?.[0]} alt="" className="h-28 w-full rounded-md object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><Link href={`/services/${s._id}`} className="text-xl font-semibold hover:text-primary">{s.serviceName}</Link><Badge status={s.status} /><Badge status={s.isActive ? "approved" : "cancelled"}>{s.isActive ? "Available" : "Paused"}</Badge></div>
                <p className="mt-1 text-sm text-muted">{s.category} · {s.location} · {moneyBoth(s.price)} · by {s.vendor?.businessName || s.vendor?.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.status !== "approved" && <Button size="sm" variant="sage" onClick={() => setS(s, "approved")}>Approve</Button>}
                  {s.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setS(s, "rejected")}>Reject</Button>}
                  {s.status !== "pending" && <Button size="sm" variant="ghost" onClick={() => setS(s, "pending")}>Move to pending</Button>}
                  <ConfirmButton onConfirm={() => del(s)} confirmLabel="Delete?">Delete</ConfirmButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DataState>
    </>
  );
}
