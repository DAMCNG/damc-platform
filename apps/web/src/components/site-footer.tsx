import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa6";
import { prisma } from "@damc/db";
import { Container, BrandMark, ThemeToggle } from "@damc/ui";
import { FALLBACK_CONTACT, type ContactContent } from "@/lib/site-content";

const SITEMAP = [
  { href: "/about", label: "About us" },
  { href: "/executives", label: "Executives" },
  { href: "/members", label: "Members" },
  { href: "/directory", label: "Business directory" },
  { href: "/news", label: "News & announcements" },
  { href: "/roster", label: "Meeting host roster" },
  { href: "/achievements", label: "Achievements" },
  { href: "/gallery", label: "Gallery" },
];

export async function SiteFooter() {
  const contactContent = await prisma.siteContent.findUnique({
    where: { page_section: { page: "CONTACT", section: "details" } },
  });
  const contact = (contactContent?.content as unknown as ContactContent) ?? FALLBACK_CONTACT;

  return (
    <footer className="border-t border-ink/10 bg-ink text-parchment dark:border-parchment/10">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrandMark size={50} />
            <span className="font-display text-xl font-semibold text-gold-bright">DAMC</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-parchment/70">
            Dignified Articulate Men&rsquo;s Club, a non-profit private membership
            association fostering unity, wealth creation and social good in Lagos.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border border-parchment/20 p-2.5 transition-all duration-200 hover:scale-110 hover:border-gold-bright hover:text-gold-bright"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-parchment/20 p-2.5 transition-all duration-200 hover:scale-110 hover:border-gold-bright hover:text-gold-bright"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-parchment/20 p-2.5 transition-all duration-200 hover:scale-110 hover:border-gold-bright hover:text-gold-bright"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href={contact.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full border border-parchment/20 p-2.5 transition-all duration-200 hover:scale-110 hover:border-gold-bright hover:text-gold-bright"
            >
              <FaTiktok size={18} />
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-parchment/50">Explore</div>
          <ul className="mt-4 space-y-2.5">
            {SITEMAP.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-parchment/80 hover:text-gold-bright">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-parchment/50">Club</div>
          <ul className="mt-4 space-y-2.5">
            {SITEMAP.slice(4).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-parchment/80 hover:text-gold-bright">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-sm text-parchment/80 hover:text-gold-bright">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-3 border-t border-parchment/10 py-6 text-xs text-parchment/50 sm:flex-row">
        <span>© {new Date().getFullYear()} Dignified Articulate Men&rsquo;s Club. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Lagos, Nigeria</span>
          <ThemeToggle className="border-parchment/20 text-parchment hover:border-gold-bright hover:text-gold-bright" />
        </div>
      </Container>
    </footer>
  );
}
