import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-primary text-white/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:px-12 xl:px-16 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-script text-4xl leading-none text-white">Wed<span className="text-gold">Plan</span></p>
          <p className="mt-3 text-sm leading-relaxed">Find photographers, venues, florists, caterers and more and request bookings from verified wedding vendors in minutes.</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-white">Explore</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/browse-services">Browse Services</Link></li>
            <li><Link className="hover:text-white" href="/sign-in">Sign In</Link></li>
            <li><Link className="hover:text-white" href="/sign-up">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-white">Contact</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li className="flex gap-2"><Mail className="size-4 mt-0.5" />{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@yourdomain.com"}</li>
            <li className="flex gap-2"><Phone className="size-4 mt-0.5" />{process.env.NEXT_PUBLIC_CONTACT_PHONE || "017*********"}</li>
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5" />{process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Mirpur, Dhaka, Bangladesh"}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-white">Follow us</h3>
          <div className="mt-3 flex gap-3">
            {[
              [Facebook, "Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL],
              [Instagram, "Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL],
              [Twitter, "Twitter", process.env.NEXT_PUBLIC_TWITTER_URL],
              [Youtube, "YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL],
            ].map(([I, n, url]) => (
              <a key={n} href={url || "#"} aria-label={n} className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><I className="size-4" /></a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs">© {new Date().getFullYear()} WedPlan. All rights reserved.</div>
    </footer>
  );
}
