"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import AuthShell from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect");
  const safe = redirect && redirect.startsWith("/") ? redirect : "/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await authClient.signIn.email({ email: fd.get("email"), password: fd.get("password") });
    setLoading(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    toast.success("Welcome back!");
    router.replace(safe);
    router.refresh();
  }

  async function google() {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: safe });
    if (error) toast.error(error.message || "Google sign-in failed");
  }

  return (
    <AuthShell><div className="w-full max-w-md">
      <Card><CardBody className="grid gap-5 p-7">
        <div><h1 className="text-3xl font-semibold">Sign in</h1><p className="text-sm text-muted">Pick up where you left off.</p></div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" required autoComplete="email" /></Field>
          <Field label="Password" htmlFor="password"><Input id="password" name="password" type="password" required autoComplete="current-password" /></Field>
          <Button type="submit" loading={loading}>Sign in</Button>
        </form>
        <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <Button variant="outline" onClick={google}><GoogleIcon />Continue with Google</Button>
        <p className="text-center text-sm text-muted">New to WedPlan? <Link href="/sign-up" className="font-medium text-primary hover:underline">Create an account</Link></p>
      </CardBody></Card>
    </div></AuthShell>
  );
}
