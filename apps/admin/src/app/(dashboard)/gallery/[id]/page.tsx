import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { FormField, inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlField } from "@/components/image-url-field";
import { updateGalleryItem, addGalleryPhoto, deleteGalleryPhoto } from "../actions";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!item) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={`Edit ${item.title}`} />

      <form action={updateGalleryItem} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <input type="hidden" name="id" value={item.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" required defaultValue={item.title} className={inputClass} />
          </FormField>
          <FormField label="Event type" htmlFor="eventType">
            <input id="eventType" name="eventType" defaultValue={item.eventType ?? ""} className={inputClass} />
          </FormField>
        </div>
        {item.mediaType === "PHOTO" && (
          <label className="mt-4 flex items-center gap-2 text-sm text-ink dark:text-parchment">
            <input type="checkbox" name="downloadable" defaultChecked={item.downloadable} className="h-4 w-4 rounded border-ink/20" />
            Downloadable
          </label>
        )}
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link href="/gallery" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Back to gallery
          </Link>
        </div>
      </form>

      {item.mediaType === "PHOTO" && (
        <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Photos</h2>
          <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
            {item.photos.length} photo{item.photos.length === 1 ? "" : "s"} in this post.
          </p>

          {item.photos.length > 0 && (
            <ul className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {item.photos.map((photo) => (
                <li key={photo.id} className="overflow-hidden rounded-lg border border-ink/10 dark:border-parchment/15">
                  <img src={photo.url} alt="" className="h-24 w-full object-cover" />
                  <form action={deleteGalleryPhoto} className="p-1.5">
                    <input type="hidden" name="id" value={photo.id} />
                    <input type="hidden" name="galleryItemId" value={item.id} />
                    <DeleteButton confirmMessage="Remove this photo?" />
                  </form>
                </li>
              ))}
            </ul>
          )}

          <form action={addGalleryPhoto} className="flex items-end gap-3">
            <input type="hidden" name="galleryItemId" value={item.id} />
            <div className="flex-1">
              <ImageUrlField id="newPhotoUrl" name="url" label="Photo URL" />
            </div>
            <SubmitButton pendingLabel="Adding…">Add</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
