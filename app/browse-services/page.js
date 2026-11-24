import { Suspense } from "react";
import BrowseClient from "./BrowseClient";
import { Spinner } from "@/components/common";

export const metadata = { title: "Browse Services" };
export default function Page() {
  return <Suspense fallback={<Spinner />}><BrowseClient /></Suspense>;
}
