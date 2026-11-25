"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyDualFromCurrency } from "@/lib/utils";

export default function Transactions() {
  const { data, loading, error, reload } = useApi("/admin/transactions");
  const [filter, setFilter] = useState("all");

  const items = data || [];

  const filtered = items.filter(
    t => filter === "all" || t.status === filter
  );

  const stats = [
    ["Total Transactions", items.length],
    ["Paid", items.filter(t => t.status === "paid").length],
    ["Pending", items.filter(t => t.status === "pending").length],
    ["Failed / Expired", items.filter(t =>
      ["failed", "expired"].includes(t.status)
    ).length]
  ];

  return (
    <>
      <PageHeader
        title="Transactions"
        text="Monitor customer payments and vendor subscriptions. Payment status is verified by Stripe."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, count]) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-muted">{label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-primary">
              {count}
            </h2>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "paid", "pending", "failed", "expired"].map(status => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}

        <Button size="sm" variant="outline" onClick={reload}>
          Refresh
        </Button>
      </div>

      <DataState
        loading={loading}
        error={error}
        reload={reload}
        empty={filtered.length === 0}
        emptyProps={{ title: "No matching transactions" }}
      >
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-line bg-blush/40 text-muted">
              <tr>
                {[
                  "Payer",
                  "Vendor",
                  "Service / Plan",
                  "Booking Status",
                  "Amount",
                  "Payment Status",
                  "Date"
                ].map(label => (
                  <th key={label} className="p-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map(t => {
                const premium = t.plan === "premium";
                const payer = premium ? t.vendor : t.customer;

                return (
                  <tr key={t._id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <p className="font-medium">
                        {payer?.name || "Unknown user"}
                      </p>
                      <p className="text-xs text-muted">
                        {payer?.email}
                      </p>
                      <p className="mt-1 text-xs text-primary">
                        {premium ? "Vendor" : "Customer"}
                      </p>
                    </td>

                    <td className="p-3">
                      <p className="font-medium">
                        {t.vendor?.businessName || t.vendor?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted">
                        {t.vendor?.email}
                      </p>
                    </td>

                    <td className="p-3">
                      {premium
                        ? "Premium Subscription"
                        : t.service?.serviceName || "Wedding Service"}
                    </td>

                    <td className="p-3">
                      {t.booking?.status
                        ? <Badge status={t.booking.status} />
                        : premium ? "Not applicable" : "Not linked"}
                    </td>

                    <td className="p-3 font-semibold text-primary">
                      {moneyDualFromCurrency(t.amount, t.currency)}
                    </td>

                    <td className="p-3">
                      <Badge status={t.status} />
                    </td>

                    <td className="p-3">
                      {fdate(t.paidAt || t.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </DataState>
    </>
  );
}