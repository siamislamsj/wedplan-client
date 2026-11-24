
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState, Reveal, ServiceCard } from "@/components/common";
import { useApi } from "@/hooks/useApi";
import { CATEGORIES } from "@/lib/utils";
import { CAT_IMG } from "@/lib/images";

const ease = [0.22, 1, 0.36, 1];

const up = (i) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.85,
    delay: 0.15 + i * 0.14,
    ease,
  },
});

const decorationLink =
  "/browse-services?category=Decoration%20%26%20Florist";

const designs = [
  {
    title: "Ivory Bloom",
    tag: "Elegant & timeless",
    image:
      "https://i.pinimg.com/736x/a8/6a/60/a86a60ad025f3ab1719a4f3c19a6ff85.jpg",
    description:
      "White rose backdrop, layered ivory drapes, warm stage lighting and a statement couple sofa.",
  },
  {
    title: "Garden Romance",
    tag: "Fresh & natural",
    image: "/images/package-garden.webp",
    description:
      "A floral ceremony arch, airy white fabrics, aisle accents and coordinated guest seating.",
  },
  {
    title: "Royal Drapes",
    tag: "Grand & traditional",
    image: "/images/package-classic.webp",
    description:
      "A layered draped backdrop, floral arrangements, decorative stage lighting and a raised platform.",
  },
];

const gallery = [
  {
    src: "/images/hero-hd.webp",
    alt: "Elegant wedding stage decoration",
    cls: "col-span-2 row-span-2",
  },
  {
    src: "/images/package-garden.webp",
    alt: "Garden wedding floral arrangement",
    cls: "col-span-1",
  },
  {
    src: "/images/package-classic.webp",
    alt: "Traditional wedding stage",
    cls: "col-span-1",
  },
  {
    src: "https://i.pinimg.com/736x/ed/e1/f3/ede1f344c2f34a61bf011720ad52c02a.jpg",
    alt: "Wedding ceremony floral arch",
    cls: "col-span-2",
  },
];

const Eyebrow = ({ n, children, light }) => (
  <p
    className={`mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] ${
      light ? "text-[#dcc08a]" : "text-gold"
    }`}
  >
    <span>{n}</span>
    <span className="h-px w-10 bg-current" />
    {children}
  </p>
);

export default function Home() {
  const featured = useApi("/services/featured", false);
  const offers = useApi("/services/offers", false);
  const cats = useApi("/services/categories", false);

  const list =
    cats.data || CATEGORIES.map((name) => ({ name }));

  const [active, setActive] = useState(CATEGORIES[0]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/hero-hd.webp)",
          }}
          initial={{ scale: 1.03 }}
          animate={{ scale: 1.12 }}
          transition={{
            duration: 26,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10251d]/85 via-[#10251d]/55 to-[#10251d]/5"
        />

        <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-40 sm:px-8 lg:px-12 xl:px-16">
          <motion.div {...up(0)}>
            <Eyebrow light n="WedPlan">
              Wedding marketplace
            </Eyebrow>
          </motion.div>

          <motion.h1
            {...up(1)}
            className="max-w-3xl text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            Plan the wedding you’ve{" "}
            <em className="text-[#e3c88f]">imagined</em>,
            one booking at a time
          </motion.h1>

          <motion.p
            {...up(2)}
            className="mt-5 max-w-xl text-base text-white/80 md:text-lg"
          >
            Compare photographers, venues, florists, caterers
            and stylists, then send a booking request to the
            vendor you trust.
          </motion.p>

          <motion.div
            {...up(3)}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/browse-services">
              <Button size="lg" variant="gold">
                Explore Wedding Services
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/40 text-white hover:bg-white/10"
              >
                Join as a vendor
              </Button>
            </Link>
          </motion.div>

          <motion.ul
            {...up(4)}
            className="mt-14 grid max-w-3xl grid-cols-1 gap-3 border-t border-white/25 pt-5 text-xs uppercase tracking-[0.2em] text-white/70 sm:grid-cols-3"
          >
            <li>Every listing reviewed</li>
            <li>Direct vendor requests</li>
            <li>Free to browse</li>
          </motion.ul>
        </div>
      </section>

      <div
        className="overflow-hidden border-b border-line py-4"
        aria-hidden
      >
        <div className="marquee flex w-max font-serif text-xl italic text-primary/80">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="whitespace-nowrap pr-10">
              {c}
              <span className="pl-10 text-gold not-italic">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow n="01">Selected for you</Eyebrow>

            <h2 className="text-4xl sm:text-5xl">
              Featured wedding services
            </h2>
          </div>

          <Link
            href="/browse-services"
            className="group flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-primary"
          >
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-12">
          <DataState
            loading={featured.loading}
            error={featured.error}
            reload={featured.reload}
            empty={featured.data?.length === 0}
            emptyProps={{
              title: "No services published yet",
              text: "Check back soon, vendors are adding new services.",
            }}
          >
            <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:nth-child(3n+2)]:mt-12">
              {featured.data?.map((s, i) => (
                <Reveal
                  key={s._id}
                  delay={(i % 3) * 0.08}
                >
                  <ServiceCard s={s} />
                </Reveal>
              ))}
            </div>
          </DataState>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-12 lg:pb-24 xl:px-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow n="02">Exclusive wedding deals</Eyebrow>

            <h2 className="text-4xl sm:text-5xl">
              Special offers
            </h2>
          </div>

          <Link
            href="/browse-services"
            className="group flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-primary"
          >
            Explore all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-10">
          <DataState
            loading={offers.loading}
            error={offers.error}
            reload={offers.reload}
            empty={offers.data?.length === 0}
            emptyProps={{
              title: "New offers are on their way",
              text: "Discover exclusive wedding deals as vendors publish their latest offers.",
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.data?.map((s, i) => (
                <Reveal key={s._id} delay={i * 0.06}>
                  <ServiceCard s={s} />
                </Reveal>
              ))}
            </div>
          </DataState>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#e2cda7] bg-gradient-to-b from-[#f3e7d4] via-[#fbf7f0] to-[#f0e2ca]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
          <div className="mb-10 rounded-3xl border border-[#e5cfa8] bg-white/75 p-6 shadow-[0_12px_40px_rgba(105,77,37,0.09)] sm:p-9">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow n="03">
                  Wedding Decoration Inspiration
                </Eyebrow>

                <h2 className="max-w-2xl text-4xl sm:text-5xl">
                  A beautiful setting for your special day
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
                  Discover thoughtfully designed wedding
                  stages, timeless floral arrangements and
                  beautiful settings that reflect your
                  personal style.
                </p>
              </div>

              <Link
                href={decorationLink}
                className="group flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-primary"
              >
                Explore decorators
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="grid items-stretch gap-7 md:grid-cols-3">
            {designs.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="h-full"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#dfc49a] bg-white shadow-[0_16px_45px_rgba(83,59,25,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-[#f3eadb]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                      Decoration Concept 0{i + 1}
                    </p>

                    <h3 className="text-3xl text-primary">
                      {item.title}
                    </h3>

                    <div className="my-4 h-px w-12 bg-[#cda764]" />

                    <p className="flex-1 text-sm leading-7 text-muted">
                      {item.description}
                    </p>

                    <div className="mt-6">
                      <Link
                        href={decorationLink}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 text-center text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                      >
                        Explore Similar Designs
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-muted">
            Every celebration deserves its own beautiful
            setting. Connect with professional decorators
            to personalize your wedding experience.
          </p>
        </div>
      </section>

      <section className="bg-blush/60">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-12 lg:py-24 xl:px-16">
          <div>
            <Reveal>
              <Eyebrow n="04">Categories</Eyebrow>

              <h2 className="max-w-xl text-4xl sm:text-5xl">
                Find the people who will make the day
              </h2>
            </Reveal>

            <ul className="mt-10 border-t border-line">
              {list.map((c, i) => (
                <li key={c.name}>
                  <Link
                    href={`/browse-services?category=${encodeURIComponent(
                      c.name
                    )}`}
                    onMouseEnter={() => setActive(c.name)}
                    onFocus={() => setActive(c.name)}
                    className="group flex items-center gap-4 border-b border-line py-4 transition-colors hover:bg-white/60 md:gap-5"
                  >
                    <span className="w-6 font-serif text-sm text-gold md:w-8">
                      0{i + 1}
                    </span>

                    <img
                      src={
                        CAT_IMG[c.name] ||
                        "/images/package-garden.webp"
                      }
                      alt={c.name}
                      loading="lazy"
                      className="h-16 w-14 shrink-0 object-cover md:h-[4.5rem] md:w-16"
                    />

                    <span className="flex-1 font-serif text-xl transition-transform duration-300 group-hover:translate-x-2 group-hover:italic md:text-3xl">
                      {c.name}
                    </span>

                    {c.count !== undefined && (
                      <span className="hidden text-sm text-muted sm:block">
                        {c.count}{" "}
                        {c.count === 1
                          ? "service"
                          : "services"}
                      </span>
                    )}

                    <ArrowRight className="size-5 shrink-0 text-gold opacity-60 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="hidden lg:block">
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-blush">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={active}
                    src={
                      CAT_IMG[active] ||
                      "/images/package-garden.webp"
                    }
                    alt={active}
                    initial={{
                      opacity: 0,
                      scale: 1.08,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.7,
                      ease,
                    }}
                    className="absolute inset-0 size-full object-cover"
                  />
                </AnimatePresence>
              </div>

              <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-muted">
                {active}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <Reveal>
          <Eyebrow n="05">Inspiration</Eyebrow>

          <h2 className="max-w-2xl text-4xl sm:text-5xl">
            Moments worth planning for
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Beautiful venues, elegant decorations and
            thoughtful details for an unforgettable
            wedding celebration.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal
              key={g.src}
              delay={(i % 3) * 0.08}
              className={`${g.cls} h-full`}
            >
              <div className="group size-full overflow-hidden rounded-xl bg-blush">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24 xl:px-16">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -bottom-3 -left-3 size-full border border-[#dcc08a]/60"
              />

              <img
                src="https://i.pinimg.com/736x/ed/e1/f3/ede1f344c2f34a61bf011720ad52c02a.jpg"
                alt="Outdoor wedding ceremony with floral arch"
                loading="lazy"
                className="relative aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow light n="06">
                The difference
              </Eyebrow>

              <h2 className="text-4xl sm:text-5xl">
                Why choose WedPlan?
              </h2>
            </Reveal>

            <div className="mt-10">
              {[
                [
                  "Every listing is reviewed",
                  "Admins approve each service before it appears, so you only see vendors that passed a check.",
                ],
                [
                  "Transparent pricing",
                  "See the starting price and location on every service card before making a booking.",
                ],
                [
                  "Direct with the vendor",
                  "Send your date, venue and wishes in one request and follow the answer from your dashboard.",
                ],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.08}>
                  <div className="grid grid-cols-[3rem_1fr] gap-2 border-t border-white/20 py-7">
                    <span className="font-serif text-xl italic text-[#dcc08a]">
                      0{i + 1}
                    </span>

                    <div>
                      <h3 className="text-2xl">{t}</h3>

                      <p className="mt-2 max-w-md text-white/70">
                        {d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <Reveal>
          <Eyebrow n="07">Simple by design</Eyebrow>

          <h2 className="text-4xl sm:text-5xl">
            How WedPlan works
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {[
            [
              "I",
              "Find",
              "Search by name, category or city and sort by price.",
            ],
            [
              "II",
              "Request",
              "Pick your event date and location, add a note, and send the request.",
            ],
            [
              "III",
              "Confirm",
              "The vendor accepts or declines. You see the status in My Bookings.",
            ],
          ].map(([n, t, d], i) => (
            <Reveal
              key={t}
              delay={i * 0.1}
              className="md:px-10 first:md:pl-0 last:md:pr-0"
            >
              <p className="font-serif text-6xl italic text-gold/80">
                {n}
              </p>

              <h3 className="mt-3 text-3xl">{t}</h3>

              <p className="mt-2 max-w-xs text-muted">
                {d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-blush/60">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 sm:px-8 md:flex-row md:items-center lg:px-12 xl:px-16">
          <div>
            <h2 className="max-w-xl text-4xl italic text-primary sm:text-5xl">
              Run a wedding business? Let couples find you.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
              Showcase your services, connect with new
              customers and grow your wedding business
              with WedPlan.
            </p>

            <Link href="/sign-up">
              <Button size="lg" className="mt-7">
                Become a vendor
              </Button>
            </Link>
          </div>

          <img
            src="/images/package-garden.webp"
            alt="Elegant floral wedding decoration"
            loading="lazy"
            className="hidden h-64 w-48 rounded-t-full object-cover md:block"
          />
        </Reveal>
      </section>
    </MotionConfig>
  );
}
