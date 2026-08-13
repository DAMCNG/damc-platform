import Link from "next/link";
import { FormField, inputClass } from "@/components/form-field";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlTextareaField } from "@/components/image-url-field";
import type { Post } from "@damc/db";

const CATEGORIES = ["NEWS", "ANNOUNCEMENT", "EDITORIAL", "NOTICE", "EVENTS"] as const;
const STATUSES = ["DRAFT", "PUBLISHED"] as const;

export function PostForm({ post, action }: { post?: Post; action: (formData: FormData) => void }) {
  const eventDateValue = post?.eventDate ? post.eventDate.toISOString().slice(0, 10) : undefined;

  return (
    <form action={action} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" required defaultValue={post?.title} className={inputClass} />
          </FormField>
          <FormField label="Author" htmlFor="authorName">
            <input id="authorName" name="authorName" required defaultValue={post?.authorName} className={inputClass} />
          </FormField>
          <FormField label="Category" htmlFor="category">
            <select id="category" name="category" defaultValue={post?.category ?? "NEWS"} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={post?.status ?? "DRAFT"} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Event date (optional)" htmlFor="eventDate" hint="A wedding, burial, etc. Set this and the post also shows up on the club calendar.">
            <input id="eventDate" name="eventDate" type="date" defaultValue={eventDateValue} className={inputClass} />
          </FormField>
          <FormField label="YouTube URL (optional)" htmlFor="youtubeUrl">
            <input id="youtubeUrl" name="youtubeUrl" defaultValue={post?.youtubeUrl ?? ""} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Excerpt" htmlFor="excerpt">
            <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputClass} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField
            label="Content"
            htmlFor="content"
            hint="Leave a blank line between paragraphs. Use **bold** and *italic* for emphasis. To place the 2nd, 3rd, etc. photo at a specific spot, type [photo] on its own line there — any photos you don't place that way appear at the end."
          >
            <textarea id="content" name="content" required rows={10} defaultValue={post?.content} className={inputClass} />
          </FormField>
        </div>
        {!post && (
          <div className="mt-4">
            <ImageUrlTextareaField
              id="photoUrls"
              name="photoUrls"
              label="Photos"
              hint="One per line. Add as many as you like — the first becomes the cover image. Manage them individually after creating the post."
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…">{post ? "Save changes" : "Create post"}</SubmitButton>
        <Link href="/news" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
          Cancel
        </Link>
      </div>
    </form>
  );
}
