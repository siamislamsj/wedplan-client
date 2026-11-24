"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import AuthShell from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card, CardBody } from "@/components/ui/card";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("customer");

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) return toast.error("Password needs an uppercase and a lowercase letter");

    setLoading(true);
    try {
      let image;
      const file = fd.get("image");
      if (file && file.size > 0) image = await uploadImage(file); // optional, via ImgBB
      const { error } = await authClient.signUp.email({ name: fd.get("name"), email: fd.get("email"), password, image, role });
      if (error) throw new Error(error.message || "Could not create account");
      toast.success("Account created. Welcome to WedPlan!");
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell><div className="w-full max-w-md">
      <Card><CardBody className="grid gap-5 p-7">
        <div><h1 className="text-3xl font-semibold">Create your account</h1><p className="text-sm text-muted">Plan a wedding or offer your services.</p></div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Field label="Full name" htmlFor="name"><Input id="name" name="name" required minLength={2} autoComplete="name" /></Field>
          <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" required autoComplete="email" /></Field>
          <Field label="Password" htmlFor="password" hint="At least 6 characters with one uppercase and one lowercase letter."><Input id="password" name="password" type="password" required autoComplete="new-password" /></Field>
          <Field label="Profile image (optional)" htmlFor="image"><Input id="image" name="image" type="file" accept="image/*" className="py-1.5" /></Field>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">I am a</legend>
            <div className="grid grid-cols-2 gap-3">
              {[["customer", "Customer", "Looking for services"], ["vendor", "Vendor", "Offering services"]].map(([v, t, d]) => (
                <label key={v} className={`cursor-pointer rounded-md border p-3 text-sm ${role === v ? "border-primary bg-blush/60" : "border-line"}`}>
                  <input type="radio" name="role" value={v} checked={role === v} onChange={() => setRole(v)} className="sr-only" />
                  <span className="block font-medium">{t}</span><span className="text-xs text-muted">{d}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit" loading={loading}>Create account</Button>
        </form>
        <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <Button variant="outline" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}><GoogleIcon />Sign up with Google</Button>
        <p className="text-center text-xs text-muted">Google sign-ups start as customer accounts.</p>
        <p className="text-center text-sm text-muted">Already registered? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link></p>
      </CardBody></Card>
    </div></AuthShell>
  );
}
