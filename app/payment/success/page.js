import { Suspense } from "react";
import SuccessClient from "./SuccessClient";
import { Spinner } from "@/components/common";

export const metadata = { title: "Payment" };
export default function Page() { return <Suspense fallback={<Spinner />}><SuccessClient /></Suspense>; }
