import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...a) => twMerge(clsx(a));
export const USD_TO_BDT = Number(process.env.NEXT_PUBLIC_USD_TO_BDT || 124.75);
export const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n || 0);
export const formatBDT = (n) => `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(n) || 0)}`;
export const moneyBoth = (n) => `${formatBDT((Number(n) || 0) * USD_TO_BDT)}  |  ${money(n)}`;
export const moneyDualFromCurrency = (n, currency = "usd") => {
  const code = String(currency || "usd").toUpperCase();
  if (code === "USD") return moneyBoth(n);
  if (code === "BDT") return `${formatBDT(n)}  |  ${money((Number(n) || 0) / USD_TO_BDT)}`;
  return money2(n, code.toLowerCase());
};
export const money2 = (n, c = "usd") => new Intl.NumberFormat("en-US", { style: "currency", currency: c.toUpperCase() }).format(n || 0);
export const fdate = (d) => (d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Not available");
export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];
