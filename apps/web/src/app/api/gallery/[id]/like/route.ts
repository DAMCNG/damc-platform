import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@damc/db";

const bodySchema = z.object({ action: z.enum(["like", "unlike"]) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const item = await prisma.galleryItem.update({
      where: { id },
      data: { likes: { increment: parsed.data.action === "like" ? 1 : -1 } },
      select: { likes: true },
    });
    return NextResponse.json({ likes: item.likes });
  } catch {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }
}
