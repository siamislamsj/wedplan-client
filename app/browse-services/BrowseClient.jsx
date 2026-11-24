"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { DataState, ServiceCard } from "@/components/common";
import { useApi, useDebounced } from "@/hooks/useApi";
import { CATEGORIES } from "@/lib/utils";
import { BANNER_IMG } from "@/lib/images";

export default function BrowseClient() {
  const sp = useSearchParams();
  const [f, setF] = useState({ q: "", location: "", category: sp.get("category") || "", sort: "", page: 1 });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v, page: k === "page" ? v : 1 }));
  const d = useDebounced(f, 400);

  const qs = new URLSearchParams({ ...(d.q && { q: d.q }), ...(d.location && { location: d.location }), ...(d.category && { category: d.category }), ...(d.sort && { sort: d.sort }), page: d.page, limit: 12 });
  const { data, loading, error, reload } = useApi(`/services?${qs}`, false);

  return (
    <>
    <div className="relative isolate flex h-56 items-end overflow-hidden bg-primary">
      <img src={BANNER_IMG} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d1b15]/85 to-[#0d1b15]/25" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 text-white">
        <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-[#dcc08a]">Marketplace</p>
        <h1 className="text-4xl sm:text-5xl">Browse wedding services</h1>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-5">
        <div className="relative md:col-span-2"><Search className="absolute left-3 top-3 size-4 text-muted" /><Input className="pl-9" placeholder="Search by service name" value={f.q} onChange={(e) => set("q", e.target.value)} aria-label="Search" /></div>
        <div className="relative"><MapPin className="absolute left-3 top-3 size-4 text-muted" /><Input className="pl-9" placeholder="Location" value={f.location} onChange={(e) => set("location", e.target.value)} aria-label="Location" /></div>
        <Select value={f.category} onChange={(e) => set("category", e.target.value)} aria-label="Category">
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select value={f.sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">
          <option value="">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
        </Select>
      </div>

      <DataState loading={loading} error={error} reload={reload} empty={data?.items?.length === 0}
        emptyProps={{ title: "No services match your search", text: "Try a different name, location or category.", action: <Button variant="outline" onClick={() => setF({ q: "", location: "", category: "", sort: "", page: 1 })}>Clear filters</Button> }}>
        <p className="mb-4 text-sm text-muted">{data?.total} {data?.total === 1 ? "service" : "services"} found</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{data?.items?.map((s) => <ServiceCard key={s._id} s={s} />)}</div>
        {data?.pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button variant="outline" disabled={data.page <= 1} onClick={() => set("page", data.page - 1)}>Previous</Button>
            <span className="text-sm text-muted">Page {data.page} of {data.pages}</span>
            <Button variant="outline" disabled={data.page >= data.pages} onClick={() => set("page", data.page + 1)}>Next</Button>
          </div>
        )}
      </DataState>
    </div>
    </>
  );
}
