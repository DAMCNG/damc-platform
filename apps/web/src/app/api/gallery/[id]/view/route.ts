import { NextResponse } from "next/server";
import { prisma } from "@damc/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const item = await prisma.galleryItem.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    return NextResponse.json({ views: item.views });
  } catch {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }
}
