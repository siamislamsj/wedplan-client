"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { ConfirmButton, DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fdate, moneyBoth, moneyDualFromCurrency } from "@/lib/utils";

export default function MyBookings() {
  const { data, loading, error, reload } = useApi("/bookings/mine");
  const history = useApi("/payments/mine");

  const [open, setOpen] = useState(null);
  const [paying, setPaying] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const items = data?.items || [];

  async function cancel(b) {
    try {
      const result = await api(`/bookings/${b._id}/cancel`, {
        method: "PATCH"
      });

      toast.success(result.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      reload();
    }
  }

  async function payNow(b) {
    setPaying(b._id);

    try {
      const result = await api("/payments/service-checkout", {
        method: "POST",
        body: {
          bookingId: b._id
        }
      });

      if (!result.url) {
        throw new Error("Checkout link unavailable");
      }

      window.location.assign(result.url);
    } catch (e) {
      toast.error(e.message);
      setPaying(null);
      reload();
    }
  }

  function downloadReceipt(payment, serviceName) {
    const content = [
      "WedPlan Payment Confirmation",
      "",
      `Transaction ID: ${payment._id}`,
      `Booking ID: ${payment.bookingId || "Not linked"}`,
      `Service: ${serviceName || "Wedding Service"}`,
      `Amount: ${payment.amount} ${payment.currency.toUpperCase()}`,
      `Payment Status: Paid`,
      `Date: ${fdate(payment.paidAt || payment.createdAt)}`,
      "",
      "Payment verified through Stripe.",
      "This is a WedPlan payment record, not a Stripe tax invoice."
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `WedPlan-Receipt-${payment._id}.txt`;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function refreshAll() {
    reload();
    history.reload();
  }

  return (
    <>
      <PageHeader
        title="My Bookings"
        text="Track your booking requests and securely pay after vendor approval."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total Bookings", items.length],
          ["Pending", items.filter(b => b.status === "pending").length],
          ["Accepted", items.filter(b => b.status === "accepted").length],
          ["Paid Bookings", items.filter(b =>
            b.payments?.some(p => p.status === "paid")
          ).length]
        ].map(([label, count]) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-muted">{label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-primary">
              {count}
            </h2>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={refreshAll}>
          Refresh Status
        </Button>
      </div>

      <DataState
        loading={loading}
        error={error}
        reload={reload}
        empty={items.length === 0}
        emptyProps={{
          title: "No booking requests yet",
          text: "Find a service you like and send your first request.",
          action: (
            <Link href="/browse-services">
              <Button>Browse Services</Button>
            </Link>
          )
        }}
      >
        <div className="grid gap-4">
          {items.map(b => {
            const payment =
              b.payments?.find(p => p.status === "paid") ||
              b.payments?.[0];

            const paid = payment?.status === "paid";

            const serviceName =
              b.service?.serviceName || "Service removed";

            const currentPrice =
              b.service?.offerPrice > 0 &&
              b.service?.offerPrice < b.service?.price
                ? b.service.offerPrice
                : b.service?.price;

            return (
              <Card
                key={b._id}
                className="flex flex-col gap-4 p-4 sm:flex-row"
              >
                <img
                  src={b.service?.images?.[0]}
                  alt={serviceName}
                  className="h-36 w-full rounded-md bg-blush object-cover sm:w-44"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold">
                    {serviceName}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Vendor: {b.vendor?.businessName || b.vendor?.name}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Event: {fdate(b.eventDate)} · {b.eventLocation}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span>Booking:</span>
                      <Badge status={b.status} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Payment:</span>

                      {payment ? (
                        <Badge status={payment.status} />
                      ) : (
                        <Badge status="pending">
                          No linked payment
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-md border border-line bg-blush/40 p-3">
                    <p className="text-xs text-muted">
                      {paid ? "Paid Amount" : "Current Package Price"}
                    </p>

                    <p className="mt-1 font-serif text-2xl font-semibold text-primary">
                      {paid
                        ? moneyDualFromCurrency(payment.amount, payment.currency)
                        : currentPrice != null
                          ? moneyBoth(currentPrice)
                          : "Unavailable"}
                    </p>

                    {paid && (
                      <p className="mt-1 text-xs text-green-700">
                        Payment successfully verified
                      </p>
                    )}
                  </div>

                  {b.status === "pending" && (
                    <p className="mt-3 text-sm text-muted">
                      Waiting for vendor approval before payment.
                    </p>
                  )}

                  {open === b._id && (
                    <div className="mt-3 grid gap-2 rounded-md bg-blush/50 p-3 text-sm">
                      <p>Booking ID: {b._id}</p>
                      <p>Requested: {fdate(b.createdAt)}</p>
                      <p>Vendor email: {b.vendor?.email}</p>
                      <p>Your message: {b.message || "No message"}</p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpen(
                        open === b._id ? null : b._id
                      )}
                    >
                      {open === b._id ? "Hide Details" : "View Details"}
                    </Button>

                    {b.status === "accepted" && !paid && (
                      <Button
                        size="sm"
                        loading={paying === b._id}
                        disabled={!!paying}
                        onClick={() => payNow(b)}
                      >
                        {payment?.status === "pending"
                          ? "Resume Payment"
                          : "Pay Now"}
                      </Button>
                    )}

                    {paid && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(payment, serviceName)}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {b.status === "pending" && (
                      <ConfirmButton
                        onConfirm={() => cancel(b)}
                        confirmLabel="Cancel request?"
                      >
                        Cancel Request
                      </ConfirmButton>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DataState>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">
          Payment History
        </h2>

        <DataState
          loading={history.loading}
          error={history.error}
          reload={history.reload}
          empty={history.data?.length === 0}
          emptyProps={{ title: "No payments yet" }}
        >
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-line bg-blush/40 text-muted">
                <tr>
                  <th className="p-3">Service</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {history.data?.map(p => (
                  <tr key={p._id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <p className="font-medium">
                        {p.serviceName || "Wedding Service"}
                      </p>

                      {!p.bookingId && (
                        <p className="text-xs text-muted">
                          Previous payment · Not linked to a booking
                        </p>
                      )}
                    </td>

                    <td className="p-3">
                      {moneyDualFromCurrency(p.amount, p.currency)}
                    </td>

                    <td className="p-3">
                      <Badge status={p.status} />
                    </td>

                    <td className="p-3">
                      {fdate(p.paidAt || p.createdAt)}
                    </td>

                    <td className="p-3">
                      {p.status === "paid" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReceipt(p, p.serviceName)}
                        >
                          Download
                        </Button>
                      ) : (
                        "Unavailable"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </DataState>
      </section>
    </>
  );
}