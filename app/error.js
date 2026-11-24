"use client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-muted">An unexpected error occurred. Try again, and if it keeps happening come back in a few minutes.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
