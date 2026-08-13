import { notFound } from "next/navigation";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { PostForm } from "@/components/news/post-form";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlField } from "@/components/image-url-field";
import { updatePost, addPostPhoto, deletePostPhoto } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit post" />
      <PostForm post={post} action={updatePost} />

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Photos</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
          {post.photos.length} photo{post.photos.length === 1 ? "" : "s"} — the first is used as the cover image.
        </p>

        {post.photos.length > 0 && (
          <ul className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {post.photos.map((photo) => (
              <li key={photo.id} className="overflow-hidden rounded-lg border border-ink/10 dark:border-parchment/15">
                <img src={photo.url} alt="" className="h-24 w-full object-cover" />
                <form action={deletePostPhoto} className="p-1.5">
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="postId" value={post.id} />
                  <DeleteButton confirmMessage="Remove this photo?" />
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={addPostPhoto} className="flex items-end gap-3">
          <input type="hidden" name="postId" value={post.id} />
          <div className="flex-1">
            <ImageUrlField id="newPostPhotoUrl" name="url" label="Photo URL" />
          </div>
          <SubmitButton pendingLabel="Adding…">Add</SubmitButton>
        </form>
      </div>
    </div>
  );
}
