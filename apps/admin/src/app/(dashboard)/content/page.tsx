import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { FormField, inputClass } from "@/components/form-field";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlField } from "@/components/image-url-field";
import {
  updateHomeHero,
  createHeroSlide,
  deleteHeroSlide,
  updateWhoWeAre,
  updateAboutContent,
  updateContactContent,
  createFounder,
  deleteFounder,
  createMilestone,
  deleteMilestone,
} from "./actions";

export const dynamic = "force-dynamic";

interface HeroContent { heading: string; subheading: string; ctaLabel: string }
interface WhoWeAreContent { heading: string; description: string; aims: string[] }
interface VisionMissionContent { vision: string; mission: string; motto: string }
interface ContactContent {
  email: string; phone: string; address: string;
  whatsapp: string; instagram: string; facebook: string; tiktok: string;
}

function SaveButton() {
  return <SubmitButton pendingLabel="Saving…">Save</SubmitButton>;
}

export default async function ContentPage() {
  const [heroRow, whoWeAreRow, vmRow, contactRow, founders, milestones, heroSlides] = await Promise.all([
    prisma.siteContent.findUnique({ where: { page_section: { page: "HOME", section: "hero" } } }),
    prisma.siteContent.findUnique({ where: { page_section: { page: "HOME", section: "who-we-are" } } }),
    prisma.siteContent.findUnique({ where: { page_section: { page: "ABOUT", section: "vision-mission" } } }),
    prisma.siteContent.findUnique({ where: { page_section: { page: "CONTACT", section: "details" } } }),
    prisma.founder.findMany({ orderBy: { order: "asc" } }),
    prisma.milestone.findMany({ orderBy: { year: "asc" } }),
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
  ]);

  const hero = heroRow?.content as unknown as HeroContent | undefined;
  const whoWeAre = whoWeAreRow?.content as unknown as WhoWeAreContent | undefined;
  const vm = vmRow?.content as unknown as VisionMissionContent | undefined;
  const contact = contactRow?.content as unknown as ContactContent | undefined;

  return (
    <div className="space-y-8">
      <PageHeader title="Site pages" description="Edit the copy blocks that appear on Home, About and Contact." />

      <form action={updateHomeHero} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Homepage hero</h2>
        <div className="space-y-4">
          <FormField label="Heading" htmlFor="heading">
            <input id="heading" name="heading" defaultValue={hero?.heading} className={inputClass} />
          </FormField>
          <FormField label="Subheading" htmlFor="subheading">
            <textarea id="subheading" name="subheading" rows={2} defaultValue={hero?.subheading} className={inputClass} />
          </FormField>
          <FormField label="Call-to-action label" htmlFor="ctaLabel">
            <input id="ctaLabel" name="ctaLabel" defaultValue={hero?.ctaLabel} className={inputClass} />
          </FormField>
          <SaveButton />
        </div>
      </form>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Hero carousel</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
          Photos that rotate behind the hero heading. Leave empty and the hero falls back to a
          plain background.
        </p>

        <form action={createHeroSlide} className="mb-5 grid gap-3 sm:grid-cols-3 sm:items-end">
          <ImageUrlField id="newSlideImageUrl" name="imageUrl" label="Image" />
          <input name="caption" placeholder="Caption (optional)" className={inputClass} />
          <SubmitButton pendingLabel="Adding…">Add slide</SubmitButton>
        </form>

        {heroSlides.length === 0 ? (
          <p className="text-sm text-bronze dark:text-parchment/60">No slides yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-3">
            {heroSlides.map((slide) => (
              <li key={slide.id} className="overflow-hidden rounded-lg border border-ink/10 dark:border-parchment/15">
                <img src={slide.imageUrl} alt="" className="h-28 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="truncate text-xs text-bronze dark:text-parchment/60">{slide.caption || "—"}</span>
                  <form action={deleteHeroSlide}>
                    <input type="hidden" name="id" value={slide.id} />
                    <DeleteButton confirmMessage="Remove this slide?" />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={updateWhoWeAre} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Homepage: &ldquo;Who we are&rdquo;</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">The teaser section just below the hero.</p>
        <div className="space-y-4">
          <FormField label="Heading" htmlFor="whoHeading">
            <input id="whoHeading" name="heading" defaultValue={whoWeAre?.heading} className={inputClass} />
          </FormField>
          <FormField label="Description" htmlFor="whoDescription">
            <textarea id="whoDescription" name="description" rows={3} defaultValue={whoWeAre?.description} className={inputClass} />
          </FormField>
          <FormField label="Aims & objectives" htmlFor="aims" hint="One per line — shown as the bulleted list beside the description.">
            <textarea
              id="aims"
              name="aims"
              rows={5}
              defaultValue={whoWeAre?.aims?.join("\n")}
              className={inputClass}
            />
          </FormField>
          <SaveButton />
        </div>
      </form>

      <form action={updateAboutContent} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">About: vision, mission & motto</h2>
        <div className="space-y-4">
          <FormField label="Vision" htmlFor="vision" hint="Leave a blank line between paragraphs. Use **bold** and *italic* for emphasis.">
            <textarea id="vision" name="vision" rows={2} defaultValue={vm?.vision} className={inputClass} />
          </FormField>
          <FormField label="Mission" htmlFor="mission" hint="Leave a blank line between paragraphs. Use **bold** and *italic* for emphasis.">
            <textarea id="mission" name="mission" rows={2} defaultValue={vm?.mission} className={inputClass} />
          </FormField>
          <FormField label="Motto" htmlFor="motto">
            <input id="motto" name="motto" defaultValue={vm?.motto} className={inputClass} />
          </FormField>
          <SaveButton />
        </div>
      </form>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">About: founders</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">Shown in &ldquo;The men who started it all&rdquo; on the About page.</p>

        <form action={createFounder} className="mb-5 grid gap-3 sm:grid-cols-3 sm:items-end">
          <input name="name" required placeholder="Name" className={inputClass} />
          <input name="title" placeholder="Title (optional)" className={inputClass} />
          <ImageUrlField id="newFounderPhotoUrl" name="photoUrl" label="Photo (optional)" />
          <SubmitButton pendingLabel="Adding…" className="sm:col-span-3">Add founder</SubmitButton>
        </form>

        <AdminTable>
          <AdminTableHead>
            <Th>Name</Th>
            <Th>Title</Th>
            <Th className="text-right">Actions</Th>
          </AdminTableHead>
          <AdminTableBody>
            {founders.length === 0 && <EmptyState message="No founders added yet." />}
            {founders.map((founder) => (
              <tr key={founder.id}>
                <Td className="font-medium">{founder.name}</Td>
                <Td className="text-bronze dark:text-parchment/60">{founder.title ?? "—"}</Td>
                <Td>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/content/founders/${founder.id}`}
                      aria-label="Edit"
                      className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                    >
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteFounder}>
                      <input type="hidden" name="id" value={founder.id} />
                      <DeleteButton confirmMessage={`Remove ${founder.name}?`} />
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">About: milestones</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">Shown in &ldquo;Our journey&rdquo; on the About page.</p>

        <form action={createMilestone} className="mb-5 grid gap-3 sm:grid-cols-4">
          <input name="year" type="number" required placeholder="Year" className={inputClass} />
          <input name="title" required placeholder="Title" className={inputClass} />
          <input name="description" placeholder="Description (optional)" className="sm:col-span-2 rounded-lg border border-ink/12 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment" />
          <SubmitButton pendingLabel="Adding…" className="sm:col-span-4">Add milestone</SubmitButton>
        </form>

        <AdminTable>
          <AdminTableHead>
            <Th>Year</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th className="text-right">Actions</Th>
          </AdminTableHead>
          <AdminTableBody>
            {milestones.length === 0 && <EmptyState message="No milestones added yet." />}
            {milestones.map((milestone) => (
              <tr key={milestone.id}>
                <Td className="font-medium">{milestone.year}</Td>
                <Td>{milestone.title}</Td>
                <Td className="max-w-sm truncate text-bronze dark:text-parchment/60">{milestone.description ?? "—"}</Td>
                <Td>
                  <div className="flex justify-end">
                    <form action={deleteMilestone}>
                      <input type="hidden" name="id" value={milestone.id} />
                      <DeleteButton confirmMessage={`Remove "${milestone.title}"?`} />
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <form action={updateContactContent} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email">
            <input id="email" name="email" type="email" defaultValue={contact?.email} className={inputClass} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <input id="phone" name="phone" defaultValue={contact?.phone} className={inputClass} />
          </FormField>
          <FormField label="WhatsApp link" htmlFor="whatsapp">
            <input id="whatsapp" name="whatsapp" defaultValue={contact?.whatsapp} className={inputClass} />
          </FormField>
          <FormField label="Instagram link" htmlFor="instagram">
            <input id="instagram" name="instagram" defaultValue={contact?.instagram} className={inputClass} />
          </FormField>
          <FormField label="Facebook link" htmlFor="facebook">
            <input id="facebook" name="facebook" defaultValue={contact?.facebook} className={inputClass} />
          </FormField>
          <FormField label="TikTok link" htmlFor="tiktok">
            <input id="tiktok" name="tiktok" defaultValue={contact?.tiktok} className={inputClass} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Address" htmlFor="address">
            <textarea id="address" name="address" rows={2} defaultValue={contact?.address} className={inputClass} />
          </FormField>
        </div>
        <div className="mt-4">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
