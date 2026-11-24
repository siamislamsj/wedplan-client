import { cn } from "@/lib/utils";

export const Card = ({ className, ...p }) => <div className={cn("rounded-sm border border-line bg-white", className)} {...p} />;
export const CardBody = ({ className, ...p }) => <div className={cn("p-5", className)} {...p} />;

const tones = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  accepted: "bg-emerald-50 text-emerald-800 border-emerald-200",
  paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
  failed: "bg-red-50 text-red-800 border-red-200",
  cancelled: "bg-stone-100 text-stone-700 border-stone-200",
  expired: "bg-stone-100 text-stone-700 border-stone-200",
  premium: "bg-gold/10 text-gold border-gold/40",
  free: "bg-stone-100 text-stone-700 border-stone-200",
};
export const Badge = ({ status, children, className }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", tones[status] || tones.free, className)}>
    {children ?? status}
  </span>
);
