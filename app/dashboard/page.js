"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PageLoader } from "@/components/common";

export default function DashboardIndex() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  useEffect(() => { if (session?.user?.role) router.replace(`/dashboard/${session.user.role}`); }, [session, router]);
  return <PageLoader />;
}
