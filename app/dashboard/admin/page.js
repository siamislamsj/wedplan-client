"use client";
import { Users, Store, UserRound, ClipboardList, Hourglass, Receipt } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader, StatCard } from "@/components/common";

export default function AdminOverview() {
  const { data: s, loading, error, reload } = useApi("/admin/stats");
  return (
    <>
      <PageHeader title="Admin overview" text="Platform health at a glance." />
      <DataState loading={loading} error={error} reload={reload}>
        {s && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Registered users" value={s.totalUsers} icon={Users} />
            <StatCard label="Vendors" value={s.totalVendors} icon={Store} />
            <StatCard label="Customers" value={s.totalCustomers} icon={UserRound} />
            <StatCard label="Services" value={s.totalServices} icon={ClipboardList} />
            <StatCard label="Pending services" value={s.pendingServices} icon={Hourglass} tone="text-gold" />
            <StatCard label="Paid transactions" value={s.totalTransactions} icon={Receipt} tone="text-sage" />
          </div>
        )}
      </DataState>
    </>
  );
}
