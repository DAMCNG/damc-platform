import Link from "next/link";
import { Pencil, Eye, Heart } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { FormField, inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlTextareaField } from "@/components/image-url-field";
import { formatEventDate } from "@/lib/dates";
import { createGalleryItem, deleteGalleryItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true, videos: true },
  });

  return (
    <div>
      <PageHeader title="Gallery" description="Albums shown on the public Gallery page — each can hold any mix of photos and YouTube videos." />

      <form action={createGalleryItem} className="mb-6 grid gap-4 rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title">
          <input id="title" name="title" required className={inputClass} />
        </FormField>
        <FormField label="Event type" htmlFor="eventType" hint="E.g. Wedding, Child Dedication">
          <input id="eventType" name="eventType" className={inputClass} />
        </FormField>
        <FormField label="Event date (optional)" htmlFor="eventDate" hint="Used to sort albums, most recent first.">
          <input id="eventDate" name="eventDate" type="date" className={inputClass} />
        </FormField>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-ink dark:text-parchment">
            <input type="checkbox" name="downloadable" defaultChecked className="h-4 w-4 rounded border-ink/20" />
            Photos downloadable
          </label>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Description (optional)" htmlFor="description">
            <textarea id="description" name="description" rows={2} className={inputClass} />
          </FormField>
        </div>
        <ImageUrlTextareaField id="photoUrls" name="photoUrls" label="Photo URLs" hint="One per line. Add as many as you like." />
        <FormField label="YouTube video URLs" htmlFor="videoUrls" hint="One per line, optional.">
          <textarea id="videoUrls" name="videoUrls" rows={3} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
        </FormField>
        <div className="sm:col-span-2">
          <SubmitButton pendingLabel="Adding…">Create album</SubmitButton>
        </div>
      </form>

      <AdminTable>
        <AdminTableHead>
          <Th>Title</Th>
          <Th>Event</Th>
          <Th>Date</Th>
          <Th>Media</Th>
          <Th>Stats</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 && <EmptyState message="No albums yet." />}
          {items.map((item) => (
            <tr key={item.id}>
              <Td className="font-medium">{item.title}</Td>
              <Td className="text-bronze dark:text-parchment/60">{item.eventType ?? "—"}</Td>
              <Td className="text-bronze dark:text-parchment/60">
                {item.eventDate ? formatEventDate(item.eventDate) : "—"}
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {item.photos.length} photo{item.photos.length === 1 ? "" : "s"}, {item.videos.length} video{item.videos.length === 1 ? "" : "s"}
              </Td>
              <Td>
                <div className="flex items-center gap-3 text-xs text-bronze dark:text-parchment/60">
                  <span className="flex items-center gap-1"><Eye size={13} /> {item.views}</span>
                  <span className="flex items-center gap-1"><Heart size={13} /> {item.likes}</span>
                </div>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/gallery/${item.id}`}
                    aria-label="Edit"
                    className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                  >
                    <Pencil size={16} />
                  </Link>
                  <form action={deleteGalleryItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton confirmMessage={`Delete "${item.title}"?`} />
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
