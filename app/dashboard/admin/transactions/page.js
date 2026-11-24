"use client";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader } from "@/components/common";
import { Badge, Card } from "@/components/ui/card";
import { fdate, moneyDualFromCurrency } from "@/lib/utils";

export default function Transactions() {
  const { data, loading, error, reload } = useApi("/admin/transactions");
  return (
    <>
      <PageHeader title="Transactions" text="Read-only. Payment status is set only by verified Stripe webhooks." />
      <DataState loading={loading} error={error} reload={reload} empty={data?.length === 0} emptyProps={{ title: "No transactions yet" }}>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-blush/40 text-muted"><tr><th className="p-3">Vendor</th><th className="p-3">Plan</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
            <tbody>
              {data?.map((t) => (
                <tr key={t._id} className="border-b border-line last:border-0">
                  <td className="p-3"><p className="font-medium">{t.vendor?.businessName || t.vendor?.name}</p><p className="text-xs text-muted">{t.vendor?.email}</p></td>
                  <td className="p-3 capitalize">{t.plan}</td>
                  <td className="p-3">{moneyDualFromCurrency(t.amount, t.currency)}</td>
                  <td className="p-3"><Badge status={t.status} /></td>
                  <td className="p-3">{fdate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </DataState>
    </>
  );
}
