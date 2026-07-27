import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { FormField, inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlTextareaField } from "@/components/image-url-field";
import { Badge } from "@damc/ui";
import { createGalleryItem, deleteGalleryItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true },
  });

  return (
    <div>
      <PageHeader title="Gallery" description="Photos and videos shown on the public Gallery page. A photo post can hold more than one image." />

      <form action={createGalleryItem} className="mb-6 grid gap-4 rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" required className={inputClass} />
          </FormField>
        </div>
        <FormField label="Type" htmlFor="mediaType">
          <select id="mediaType" name="mediaType" defaultValue="PHOTO" className={inputClass}>
            <option value="PHOTO">Photo</option>
            <option value="VIDEO">Video (YouTube)</option>
          </select>
        </FormField>
        <FormField label="Event type" htmlFor="eventType" hint="E.g. Wedding, Child Dedication">
          <input id="eventType" name="eventType" className={inputClass} />
        </FormField>

        <div className="sm:col-span-2">
          <ImageUrlTextareaField
            id="photoUrls"
            name="photoUrls"
            label="Photo URLs"
            hint="One per line. Used when type is Photo — add as many as you like."
          />
        </div>
        <div className="sm:col-span-2">
          <FormField label="YouTube URL" htmlFor="url" hint="Used when type is Video.">
            <input id="url" name="url" className={inputClass} placeholder="https://youtube.com/watch?v=..." />
          </FormField>
        </div>

        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-ink dark:text-parchment">
            <input type="checkbox" name="downloadable" defaultChecked className="h-4 w-4 rounded border-ink/20" />
            Downloadable (photos only)
          </label>
        </div>
        <div className="sm:col-span-4">
          <SubmitButton pendingLabel="Adding…">Add to gallery</SubmitButton>
        </div>
      </form>

      <AdminTable>
        <AdminTableHead>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Event</Th>
          <Th>Photos</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 && <EmptyState message="No gallery items yet." />}
          {items.map((item) => (
            <tr key={item.id}>
              <Td className="font-medium">{item.title}</Td>
              <Td><Badge variant={item.mediaType === "VIDEO" ? "gold" : "ink"}>{item.mediaType}</Badge></Td>
              <Td className="text-bronze dark:text-parchment/60">{item.eventType ?? "—"}</Td>
              <Td className="text-bronze dark:text-parchment/60">
                {item.mediaType === "PHOTO" ? `${item.photos.length} photo${item.photos.length === 1 ? "" : "s"}` : "—"}
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
