"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Avatar({ user, size = 8 }) {
  const dim = { width: size * 4, height: size * 4 };
  return user?.image ? (
    <img src={user.image} alt="" style={dim} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span style={dim} className="grid shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
      {user?.name?.[0]?.toUpperCase() || "U"}
    </span>
  );
}

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession(); // reactive: updates instantly on login/logout
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const user = session?.user;

  const links = [["Home", "/"], ["Browse Services", "/browse-services"]];

  async function logout() {
    await authClient.signOut();
    resetToken();
    setMenu(false); setOpen(false);
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  }

  const linkCls = (href) => cn("text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold", pathname === href ? "text-gold" : "text-ink/80");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-script text-4xl leading-none text-primary">
          Wed<span className="text-gold">Plan</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <Link key={h} href={h} className={linkCls(h)}>{l}</Link>)}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? <div className="h-9 w-32 animate-pulse rounded-md bg-blush" /> : !user ? (
            <>
              <Link href="/sign-in"><Button variant="ghost">Sign In</Button></Link>
              <Link href="/sign-up"><Button>Sign Up</Button></Link>
            </>
          ) : (
            <div className="relative" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setMenu(false)}>
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 hover:bg-blush/60 cursor-pointer" aria-expanded={menu}>
                <Avatar user={user} />
                <span className="max-w-32 truncate text-sm font-medium">{user.name}</span>
                <ChevronDown className="size-4" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-60 rounded-lg border border-line bg-white p-1 shadow-lg">
                  <div className="flex items-center gap-3 border-b border-line px-3 py-3">
                    <Avatar user={user} size={10} />
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-muted capitalize">{user.role}</p></div>
                  </div>
                  <Link onClick={() => setMenu(false)} href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-blush/60"><LayoutDashboard className="size-4" />Dashboard</Link>
                  <Link onClick={() => setMenu(false)} href={`/dashboard/${user.role}/profile`} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-blush/60"><Settings className="size-4" />Profile Settings</Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-700 hover:bg-red-50 cursor-pointer"><LogOut className="size-4" />Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden p-2 cursor-pointer" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-4 py-4 md:hidden grid gap-3">
          {links.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className={linkCls(h)}>{l}</Link>)}
          {!user ? (
            <div className="flex gap-2"><Link href="/sign-in" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link><Link href="/sign-up" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full">Sign Up</Button></Link></div>
          ) : (
            <>
              <div className="flex items-center gap-3"><Avatar user={user} size={10} /><span className="font-medium">{user.name}</span></div>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm">Dashboard</Link>
              <Link href={`/dashboard/${user.role}/profile`} onClick={() => setOpen(false)} className="text-sm">Profile Settings</Link>
              <button onClick={logout} className="text-left text-sm text-red-700 cursor-pointer">Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
