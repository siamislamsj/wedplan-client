"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { CATEGORIES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";

export default function ServiceForm({ initial }) {
  const router = useRouter();
  const [images, setImages] = useState(initial?.images || []);
  const [busy, setBusy] = useState(false);
  const [upgrade, setUpgrade] = useState(false);

  async function onFiles(e) {
    const files = [...e.target.files];
    if (!files.length) return;
    if (images.length + files.length > 6) return toast.error("You can add up to 6 images");
    setBusy(true);
    try { const urls = await Promise.all(files.map(uploadImage)); setImages((p) => [...p, ...urls]); toast.success("Image uploaded"); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); e.target.value = ""; }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!images.length) return toast.error("Upload at least one image");
    setBusy(true); setUpgrade(false);
    const body = { serviceName: fd.get("serviceName"), category: fd.get("category"), description: fd.get("description"), price: fd.get("price"), offerPrice: fd.get("offerPrice") || null, location: fd.get("location"), images };
    try {
      await api(initial ? `/vendor/services/${initial._id}` : "/vendor/services", { method: initial ? "PATCH" : "POST", body });
      toast.success(initial ? "Service updated and sent for review" : "Service submitted for review");
      router.push("/dashboard/vendor/services");
    } catch (err) {
      toast.error(err.message);
      if (err.code === "PLAN_LIMIT") setUpgrade(true);
    } finally { setBusy(false); }
  }

  return (
    <Card className="max-w-3xl"><CardBody>
      <form onSubmit={onSubmit} className="grid gap-5">
        <Field label="Service name" htmlFor="serviceName"><Input id="serviceName" name="serviceName" defaultValue={initial?.serviceName} required minLength={3} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category"><Select id="category" name="category" defaultValue={initial?.category || ""} required><option value="" disabled>Select category</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Price (USD)" htmlFor="price" hint="Enter the price in USD. Customers will see both USD and an estimated BDT conversion."><Input id="price" name="price" type="number" min="1" step="1" defaultValue={initial?.price} required /></Field>
        </div>
        <Field label="Offer price (optional, USD)" htmlFor="offerPrice" hint="Enter a discounted USD price below the regular price. Both USD and estimated BDT will be shown."><Input id="offerPrice" name="offerPrice" type="number" min="1" step="1" defaultValue={initial?.offerPrice || ""} placeholder="Leave blank for no offer" /></Field>
        <Field label="Location" htmlFor="location"><Input id="location" name="location" defaultValue={initial?.location} required placeholder="City or area" /></Field>
        <Field label="Description" htmlFor="description"><Textarea id="description" name="description" defaultValue={initial?.description} required minLength={20} className="min-h-36" /></Field>
        <Field label="Service images" htmlFor="files" hint="Up to 6 images, 5 MB each. The first image is the cover.">
          <Input id="files" type="file" accept="image/*" multiple onChange={onFiles} disabled={busy} className="py-1.5" />
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((u) => (
                <div key={u} className="relative"><img src={u} alt="" className="size-20 rounded-md object-cover" />
                  <button type="button" aria-label="Remove image" onClick={() => setImages(images.filter((x) => x !== u))} className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-red-600 text-white cursor-pointer"><X className="size-3" /></button></div>
              ))}
            </div>
          )}
        </Field>
        {upgrade && <div className="rounded-md border border-gold/40 bg-gold/10 p-3 text-sm">Free vendors can keep 3 active services. <Link href="/dashboard/vendor/subscription" className="font-medium text-primary underline">Upgrade to Premium</Link> to publish more.</div>}
        <div className="flex gap-3"><Button type="submit" loading={busy}>{initial ? "Save changes" : "Submit service"}</Button><Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button></div>
      </form>
    </CardBody></Card>
  );
}
