"use client";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi, useDebounced } from "@/hooks/useApi";
import { DataState, PageHeader, ConfirmButton } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Avatar } from "@/components/Navbar";
import { fdate } from "@/lib/utils";

export default function ManageUsers() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const dq = useDebounced(q);
  const { data, loading, error, reload } = useApi(`/admin/users?${new URLSearchParams({ ...(dq && { q: dq }), ...(role && { role }) })}`);
  const [view, setView] = useState(null);

  async function block(u, isBlocked) {
    try { const r = await api(`/admin/users/${u._id}/block`, { method: "PATCH", body: { isBlocked } }); toast.success(r.message); reload(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="Manage users" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input className="sm:col-span-2" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
        <Select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role"><option value="">All roles</option><option value="customer">Customers</option><option value="vendor">Vendors</option><option value="admin">Admins</option></Select>
      </div>
      <DataState loading={loading} error={error} reload={reload} empty={data?.length === 0} emptyProps={{ title: "No users found" }}>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-line bg-blush/40 text-muted"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Joined</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {data?.map((u) => (
                <Fragment key={u._id}>
                  <tr className="border-b border-line last:border-0">
                    <td className="p-3"><div className="flex items-center gap-3"><Avatar user={u} /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div></div></td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3"><Badge status={u.isBlocked ? "rejected" : "approved"}>{u.isBlocked ? "Blocked" : "Active"}</Badge></td>
                    <td className="p-3">{fdate(u.createdAt)}</td>
                    <td className="p-3"><div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setView(view === u._id ? null : u._id)}>Details</Button>
                      {u.role !== "admin" && (u.isBlocked ? <Button size="sm" variant="outline" onClick={() => block(u, false)}>Unblock</Button> : <ConfirmButton onConfirm={() => block(u, true)} confirmLabel="Block?">Block</ConfirmButton>)}
                    </div></td>
                  </tr>
                  {view === u._id && <tr className="bg-blush/30"><td colSpan={5} className="p-3 text-sm">Business: {u.businessName || "Not provided"} · Plan: {u.subscriptionPlan || "free"}{u.subscriptionExpiresAt && ` (until ${fdate(u.subscriptionExpiresAt)})`} · Email verified: {u.emailVerified ? "yes" : "no"} · ID: {u._id}</td></tr>}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Card>
      </DataState>
    </>
  );
}
