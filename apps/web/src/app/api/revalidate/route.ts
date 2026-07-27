import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bodySchema = z.object({
  secret: z.string(),
  paths: z.array(z.string()).min(1).max(20),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!process.env.REVALIDATE_SECRET || parsed.data.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const path of parsed.data.paths) revalidatePath(path);

  return NextResponse.json({ revalidated: parsed.data.paths });
}
