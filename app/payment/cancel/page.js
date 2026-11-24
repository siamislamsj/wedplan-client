import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment cancelled" };
export default function Cancel() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <XCircle className="mx-auto size-14 text-muted" />
      <h1 className="mt-4 text-3xl font-semibold">Payment cancelled</h1>
      <p className="mt-2 text-muted">You weren’t charged. Upgrade whenever you’re ready.</p>
      <Link href="/dashboard/vendor/subscription"><Button className="mt-8">Back to Subscription</Button></Link>
    </div>
  );
}
