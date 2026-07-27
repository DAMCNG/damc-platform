import Link from "next/link";
import { Plus, Pencil, Eye, Heart } from "lucide-react";
import { prisma } from "@damc/db";
import { Badge } from "@damc/ui";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { POST_CATEGORY_LABELS } from "@/lib/labels";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="News & blog"
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
        action={
          <Link href="/news/new" className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright">
            <Plus size={16} /> New post
          </Link>
        }
      />

      <AdminTable>
        <AdminTableHead>
          <Th>Title</Th>
          <Th>Category</Th>
          <Th>Status</Th>
          <Th>Stats</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {posts.length === 0 && <EmptyState message="No posts yet." />}
          {posts.map((post) => (
            <tr key={post.id}>
              <Td className="max-w-xs truncate font-medium">{post.title}</Td>
              <Td className="text-bronze dark:text-parchment/60">{POST_CATEGORY_LABELS[post.category]}</Td>
              <Td>
                <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>{post.status}</Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-3 text-xs text-bronze dark:text-parchment/60">
                  <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
                  <span className="flex items-center gap-1"><Heart size={13} /> {post.likes}</span>
                </div>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/news/${post.id}`} aria-label="Edit" className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright">
                    <Pencil size={16} />
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <DeleteButton confirmMessage={`Delete "${post.title}"?`} />
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
