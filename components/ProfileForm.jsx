"use client";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Avatar } from "@/components/Navbar";
import { PageHeader, Spinner } from "@/components/common";

export default function ProfileForm() {
  const { data: session } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const user = session?.user;
  if (!user) return <Spinner />;

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const patch = { name: fd.get("name") };
      const file = fd.get("image");
      if (file && file.size > 0) patch.image = await uploadImage(file);
      if (user.role === "vendor") patch.businessName = fd.get("businessName");
      const { error } = await authClient.updateUser(patch);
      if (error) throw new Error(error.message || "Could not update profile");
      toast.success("Profile updated");
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Profile settings" text="Your role and subscription can’t be changed here." />
      <Card className="max-w-xl"><CardBody>
        <div className="mb-5 flex items-center gap-4"><Avatar user={user} size={16} /><div><p className="font-semibold">{user.email}</p><Badge status="free" className="mt-1">{user.role}</Badge></div></div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Field label="Full name" htmlFor="name"><Input id="name" name="name" defaultValue={user.name} required minLength={2} /></Field>
          {user.role === "vendor" && <Field label="Business name" htmlFor="businessName"><Input id="businessName" name="businessName" defaultValue={user.businessName || ""} maxLength={100} /></Field>}
          <Field label="New profile image" htmlFor="image" hint="Leave empty to keep your current image."><Input id="image" name="image" type="file" accept="image/*" className="py-1.5" /></Field>
          <Button type="submit" loading={busy} className="justify-self-start">Save changes</Button>
        </form>
      </CardBody></Card>
    </>
  );
}
