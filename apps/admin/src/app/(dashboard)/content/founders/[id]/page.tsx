import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { FormField, inputClass } from "@/components/form-field";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlField } from "@/components/image-url-field";
import { updateFounder } from "../../actions";

export default async function EditFounderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const founder = await prisma.founder.findUnique({ where: { id } });
  if (!founder) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={`Edit ${founder.name}`} />

      <form action={updateFounder} className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <input type="hidden" name="id" value={founder.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name">
            <input id="name" name="name" required defaultValue={founder.name} className={inputClass} />
          </FormField>
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" defaultValue={founder.title ?? ""} className={inputClass} />
          </FormField>
          <ImageUrlField id="photoUrl" name="photoUrl" label="Photo (optional)" defaultValue={founder.photoUrl} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link href="/content" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Back to site pages
          </Link>
        </div>
      </form>
    </div>
  );
}
