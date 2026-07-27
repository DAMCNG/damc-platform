import { NextResponse } from "next/server";
import { prisma } from "@damc/db";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    return NextResponse.json({ views: post.views });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
