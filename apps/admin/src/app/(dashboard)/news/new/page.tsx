import { PageHeader } from "@/components/page-header";
import { PostForm } from "@/components/news/post-form";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="New post" description="Save as Draft to preview, or Published to make it live immediately." />
      <PostForm action={createPost} />
    </div>
  );
}
