import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-serif text-7xl text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page isn’t on the guest list</h1>
      <p className="mt-3 text-muted">The link may be broken or the page was removed.</p>
      <Link href="/"><Button className="mt-6">Back to home</Button></Link>
    </div>
  );
}
