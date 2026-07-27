import type { Metadata } from "next";
import { FaEnvelope, FaPhone, FaLocationDot, FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa6";
import { prisma } from "@damc/db";
import { Container, Reveal, SectionHeading } from "@damc/ui";
import { EnquiryForm } from "@/components/contact/enquiry-form";

export const metadata: Metadata = {
  title: "Contact & Enquiries",
  description: "Get in touch with the Dignified Articulate Men's Club — email, phone, address and social media.",
};

export const revalidate = 3600;

interface ContactContent {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

const FALLBACK_CONTACT: ContactContent = {
  email: "info@damcng.com",
  phone: "+234 800 000 0000",
  address: "Placeholder address, Lagos, Nigeria",
  whatsapp: "https://wa.me/2348000000000",
  instagram: "https://instagram.com/damcofficial",
  facebook: "https://facebook.com/damcofficial",
  tiktok: "https://tiktok.com/@damcofficial",
};

export default async function ContactPage() {
  const contactContent = await prisma.siteContent.findUnique({
    where: { page_section: { page: "CONTACT", section: "details" } },
  });
  const contact = (contactContent?.content as unknown as ContactContent) ?? FALLBACK_CONTACT;

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Say hello
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Contact us
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Questions, partnership ideas, or interested in joining? We'd love to hear from you.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Send an enquiry" title="Write to us" />
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading eyebrow="Reach us directly" title="Details" />
            <div className="mt-8 space-y-5">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 rounded-xl2 border border-ink/8 bg-white p-4 shadow-card transition-colors hover:border-gold-deep dark:border-parchment/10 dark:bg-ink-soft/40">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                  <FaEnvelope size={16} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">Email</div>
                  <div className="text-sm font-medium text-ink dark:text-parchment">{contact.email}</div>
                </div>
              </a>

              <a href={`tel:${contact.phone}`} className="flex items-center gap-4 rounded-xl2 border border-ink/8 bg-white p-4 shadow-card transition-colors hover:border-gold-deep dark:border-parchment/10 dark:bg-ink-soft/40">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                  <FaPhone size={16} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">Phone</div>
                  <div className="text-sm font-medium text-ink dark:text-parchment">{contact.phone}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl2 border border-ink/8 bg-white p-4 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                  <FaLocationDot size={16} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">Address</div>
                  <div className="text-sm font-medium text-ink dark:text-parchment">{contact.address}</div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a href={contact.whatsapp} aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 hover:scale-110 hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright">
                  <FaWhatsapp size={19} />
                </a>
                <a href={contact.instagram} aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 hover:scale-110 hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright">
                  <FaInstagram size={19} />
                </a>
                <a href={contact.facebook} aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 hover:scale-110 hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright">
                  <FaFacebook size={19} />
                </a>
                <a href={contact.tiktok} aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 hover:scale-110 hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright">
                  <FaTiktok size={19} />
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
