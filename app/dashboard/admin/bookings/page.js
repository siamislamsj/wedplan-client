"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyDualFromCurrency } from "@/lib/utils";

export default function ManageBookings() {
  const { data, loading, error, reload } = useApi("/admin/bookings");
  const [filter, setFilter] = useState("all");

  const items = data || [];

  const filtered = items.filter(
    b => filter === "all" || b.status === filter
  );

  return (
    <>
      <PageHeader
        title="Manage Bookings"
        text="Monitor customer bookings and their payment status."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {["pending", "accepted", "rejected", "cancelled"].map(status => (
          <Card key={status} className="p-4">
            <p className="text-sm capitalize text-muted">
              {status}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-primary">
              {items.filter(b => b.status === status).length}
            </h2>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "accepted", "rejected", "cancelled"].map(status => (
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
        emptyProps={{ title: "No booking requests found" }}
      >
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-line bg-blush/40 text-muted">
              <tr>
                {[
                  "Customer",
                  "Vendor",
                  "Service",
                  "Event Date",
                  "Location",
                  "Booking Status",
                  "Payment Status",
                  "Paid Amount",
                  "Requested"
                ].map(label => (
                  <th key={label} className="p-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map(b => {
                const payment =
                  b.payments?.find(p => p.status === "paid") ||
                  b.payments?.[0];

                return (
                  <tr key={b._id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <p className="font-medium">
                        {b.customer?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted">
                        {b.customer?.email}
                      </p>
                    </td>

                    <td className="p-3">
                      <p>
                        {b.vendor?.businessName || b.vendor?.name}
                      </p>
                      <p className="text-xs text-muted">
                        {b.vendor?.email}
                      </p>
                    </td>

                    <td className="p-3">
                      {b.service?.serviceName || "Service removed"}
                    </td>

                    <td className="p-3">{fdate(b.eventDate)}</td>

                    <td className="p-3">{b.eventLocation}</td>

                    <td className="p-3">
                      <Badge status={b.status} />
                    </td>

                    <td className="p-3">
                      {payment
                        ? <Badge status={payment.status} />
                        : <span className="text-muted">No linked payment</span>}
                    </td>

                    <td className="p-3 font-medium">
                      {payment?.status === "paid"
                        ? moneyDualFromCurrency(payment.amount, payment.currency)
                        : "Not paid"}
                    </td>

                    <td className="p-3">{fdate(b.createdAt)}</td>
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