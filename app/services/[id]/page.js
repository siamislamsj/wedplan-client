"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crown, MapPin, Tag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";
import { Avatar } from "@/components/Navbar";
import { DataState } from "@/components/common";
import { moneyBoth } from "@/lib/utils";

export default function ServiceDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const {
    data: s,
    loading,
    error,
    reload
  } = useApi(`/services/${id}`);

  const [img, setImg] = useState(0);
  const [saving, setSaving] = useState(false);

  const role = session?.user?.role;

  const own =
    s && String(s.vendorId) === String(session?.user?.id);

  const tomorrow = new Date(Date.now() + 864e5)
    .toISOString().slice(0, 10);

  async function book(e) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    setSaving(true);

    try {
      await api("/bookings", {
        method: "POST",
        body: {
          serviceId: id,
          eventDate: fd.get("eventDate"),
          eventLocation: fd.get("eventLocation"),
          message: fd.get("message")
        }
      });

      toast.success("Booking request sent to the vendor");

      router.push("/dashboard/customer/bookings");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
      <DataState
        loading={loading}
        error={
          error &&
          (error.includes("not") || error.includes("Invalid")
            ? "This service doesn't exist or is no longer available."
            : error)
        }
        reload={reload}
      >
        {s && (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-blush">
                <img
                  src={s.images?.[img]}
                  alt={s.serviceName}
                  className="size-full object-cover"
                />
              </div>

              {s.images?.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {s.images.map((u, i) => (
                    <button
                      key={u}
                      onClick={() => setImg(i)}
                      className={`size-20 shrink-0 overflow-hidden rounded-md border-2 cursor-pointer ${
                        i === img
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={u}
                        alt=""
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <h1 className="mt-6 text-4xl font-semibold">
                {s.serviceName}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Tag className="size-4" />
                  {s.category}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {s.location}
                </span>
              </div>

              <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/85">
                {s.description}
              </p>
            </div>

            <aside className="grid content-start gap-5 lg:col-span-2">
              <Card>
                <CardBody>
                  <div className="rounded-lg border border-line bg-blush/40 p-4">
                    <p className="text-sm text-muted">
                      One time event package starting price
                    </p>

                    <div className="mt-2 flex flex-wrap items-baseline gap-3">
                      {s.offerPrice > 0 && s.offerPrice < s.price ? (
                        <>
                          <p className="font-serif text-3xl font-semibold text-primary">
                            {moneyBoth(s.offerPrice)}
                          </p>

                          <p className="text-sm text-muted line-through">
                            {moneyBoth(s.price)}
                          </p>

                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                            Special Offer
                          </span>
                        </>
                      ) : (
                        <p className="font-serif text-3xl font-semibold text-primary">
                          {moneyBoth(s.price)}
                        </p>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-muted">
                      Per event, not monthly. BDT amounts are estimates.
                    </p>
                  </div>

                  {role === "customer" && s.bookable && (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <a
                        href="#contact-vendor"
                        className="flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                      >
                        Book Now
                      </a>

                      <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard/customer/bookings")}
                      >
                        My Bookings
                      </Button>
                    </div>
                  )}

                  {!session && (
                    <Link
                      href="/sign-in"
                      className="mt-4 inline-block text-sm text-primary underline"
                    >
                      Sign in to book this service
                    </Link>
                  )}

                  <p className="mt-4 text-sm text-muted">
                    Submit your booking request first. Once the vendor accepts,
                    you can securely pay from your dashboard.
                  </p>

                  <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <Avatar user={s.vendor} size={11} />

                    <div>
                      <p className="flex items-center gap-1 font-medium">
                        {s.vendor?.businessName || s.vendor?.name}

                        {s.vendor?.isPremium && (
                          <Crown
                            className="size-4 text-gold"
                            aria-label="Premium vendor"
                          />
                        )}
                      </p>

                      {s.vendor?.businessName && (
                        <p className="text-xs text-muted">
                          {s.vendor.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h2
                    id="contact-vendor"
                    className="scroll-mt-24 text-2xl font-semibold"
                  >
                    Contact Us / Request a Booking
                  </h2>

                  {!s.bookable ? (
                    <p className="mt-2 text-sm text-muted">
                      This service is not currently open for booking.
                    </p>
                  ) : role === "customer" ? (
                    <form onSubmit={book} className="mt-4 grid gap-4">
                      <Field label="Event date" htmlFor="eventDate">
                        <Input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          min={tomorrow}
                          required
                        />
                      </Field>

                      <Field label="Event location" htmlFor="eventLocation">
                        <Input
                          id="eventLocation"
                          name="eventLocation"
                          required
                          placeholder="Venue or city"
                        />
                      </Field>

                      <Field label="Additional message" htmlFor="message">
                        <Textarea
                          id="message"
                          name="message"
                          maxLength={1000}
                          placeholder="Guest count, style, special requests..."
                        />
                      </Field>

                      <Button type="submit" loading={saving}>
                        Send Booking Request
                      </Button>
                    </form>
                  ) : (
                    <p className="mt-2 text-sm text-muted">
                      {!session
                        ? "Sign in with a customer account to book."
                        : own
                          ? "This is your own service, so you cannot book it."
                          : role === "vendor"
                            ? "Vendor accounts cannot book services."
                            : "Admin accounts cannot submit booking requests."}

                      {own && (
                        <>
                          {" "}
                          <Link
                            href="/dashboard/vendor/services"
                            className="text-primary underline"
                          >
                            Manage it
                          </Link>
                        </>
                      )}
                    </p>
                  )}
                </CardBody>
              </Card>
            </aside>
          </div>
        )}
      </DataState>
    </div>
  );
}