"use client";
import { PageHeader } from "@/components/common";
import ServiceForm from "@/components/ServiceForm";

export default function AddService() {
  return (
    <>
      <PageHeader title="Add a service" text="New services are reviewed by an admin before customers can see them." />
      <ServiceForm />
    </>
  );
}
