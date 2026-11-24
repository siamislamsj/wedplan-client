"use client";
import Link from "next/link";
import { Store, CheckCircle2, Inbox, CalendarCheck, Crown } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader, StatCard } from "@/components/common";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VendorOverview() {
  const { data: s, loading, error, reload } = useApi("/vendor/stats");
  return (
    <>
      <PageHeader title="Vendor overview" text="A snapshot of your services and requests.">
        <Link href="/dashboard/vendor/add-service"><Button>Add service</Button></Link>
      </PageHeader>
      <DataState loading={loading} error={error} reload={reload}>
        {s && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total services" value={s.totalServices} icon={Store} />
            <StatCard label="Active (approved & available)" value={s.activeServices} icon={CheckCircle2} tone="text-sage" />
            <StatCard label="Pending booking requests" value={s.pendingBookings} icon={Inbox} tone="text-gold" />
            <StatCard label="Accepted bookings" value={s.acceptedBookings} icon={CalendarCheck} tone="text-sage" />
            <StatCard label="Current plan" value={<Badge status={s.plan}>{s.plan === "premium" ? "Premium" : "Free"}</Badge>} icon={Crown} tone="text-gold" />
          </div>
        )}
      </DataState>
    </>
  );
}
