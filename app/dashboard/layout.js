"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, Store, PlusCircle, Inbox, Crown, Settings, CalendarHeart, Users, ClipboardCheck, Receipt, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { PageLoader } from "@/components/common";
import { cn } from "@/lib/utils";

const NAV = {
  vendor: [["Overview", "/dashboard/vendor", LayoutDashboard], ["My Services", "/dashboard/vendor/services", Store], ["Add Service", "/dashboard/vendor/add-service", PlusCircle], ["Booking Requests", "/dashboard/vendor/bookings", Inbox], ["Subscription", "/dashboard/vendor/subscription", Crown], ["Profile Settings", "/dashboard/vendor/profile", Settings]],
  customer: [["Overview", "/dashboard/customer", LayoutDashboard], ["My Bookings", "/dashboard/customer/bookings", CalendarHeart], ["Profile Settings", "/dashboard/customer/profile", Settings]],
  admin: [["Overview", "/dashboard/admin", LayoutDashboard], ["Manage Users", "/dashboard/admin/users", Users], ["Manage Services", "/dashboard/admin/services", ClipboardCheck], ["Transactions", "/dashboard/admin/transactions", Receipt], ["Profile Settings", "/dashboard/admin/profile", Settings]],
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role;
  const seg = pathname.split("/")[2]; // vendor | customer | admin | undefined
  const wrongRole = !!seg && seg !== role;

  useEffect(() => {
    if (isPending) return;
    if (!session) return router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    if (session.user.isBlocked) { authClient.signOut().then(() => { toast.error("Your account has been blocked"); router.replace("/sign-in"); }); return; }
    if (wrongRole) { toast.error("You don’t have access to that dashboard"); router.replace(`/dashboard/${role}`); }
  }, [isPending, session, wrongRole, role, pathname, router]);

  if (isPending || !session || wrongRole || !NAV[role]) return <PageLoader />;

  const nav = (
    <nav className="grid gap-1 p-3">
      {NAV[role].map(([label, href, Icon]) => (
        <Link key={href} href={href} onClick={() => setOpen(false)}
          className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", pathname === href ? "bg-primary text-white" : "text-ink/80 hover:bg-blush/70")}>
          <Icon className="size-4" />{label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
        <span className="font-serif text-lg font-semibold capitalize">{role} dashboard</span>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="cursor-pointer">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-b border-line bg-white md:hidden">{nav}</div>}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-white md:block">
        <p className="px-6 pt-6 font-serif text-xl font-semibold capitalize text-primary">{role} dashboard</p>
        {nav}
      </aside>
      <section className="min-w-0 flex-1 p-4 md:p-8">{children}</section>
    </div>
  );
}
