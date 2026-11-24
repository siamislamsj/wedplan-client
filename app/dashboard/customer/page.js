"use client";
import Link from "next/link";
import { CalendarHeart, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi("/bookings/mine");
  const s = data?.stats;
  return (
    <>
      <PageHeader title="Your wedding planning" text="Track every booking request in one place.">
        <Link href="/browse-services"><Button>Find services</Button></Link>
      </PageHeader>
      <DataState loading={loading} error={error} reload={reload}>
        {s && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total requests" value={s.total} icon={CalendarHeart} />
            <StatCard label="Pending" value={s.pending} icon={Clock} tone="text-gold" />
            <StatCard label="Accepted" value={s.accepted} icon={CheckCircle2} tone="text-sage" />
            <StatCard label="Rejected" value={s.rejected} icon={XCircle} tone="text-red-600" />
          </div>
        )}
      </DataState>
    </>
  );
}
