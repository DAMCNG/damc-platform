import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@damc/db";

const bodySchema = z.object({ action: z.enum(["like", "unlike"]) });

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { likes: { increment: parsed.data.action === "like" ? 1 : -1 } },
      select: { likes: true },
    });
    return NextResponse.json({ likes: post.likes });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
