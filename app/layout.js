import { Bodoni_Moda, Jost, Great_Vibes } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes" });
const sans = Jost({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: { default: "WedPlan | Wedding Planning Platform", template: "%s | WedPlan" },
  description: "Discover trusted wedding vendors, compare services and request bookings in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
