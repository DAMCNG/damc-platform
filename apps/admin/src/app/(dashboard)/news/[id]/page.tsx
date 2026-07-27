import { notFound } from "next/navigation";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { PostForm } from "@/components/news/post-form";
import { updatePost } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit post" />
      <PostForm post={post} action={updatePost} />
    </div>
  );
}
