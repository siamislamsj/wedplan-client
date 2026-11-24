"use client";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { DataState, PageHeader } from "@/components/common";
import ServiceForm from "@/components/ServiceForm";

export default function EditService() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(`/vendor/services/${id}`);
  return (
    <>
      <PageHeader title="Edit service" text="Saving sends the service back for admin review." />
      <DataState loading={loading} error={error} reload={reload}>{data && <ServiceForm initial={data} />}</DataState>
    </>
  );
}
