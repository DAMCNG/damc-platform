import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@damc/db";

const enquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().max(160).optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const parsed = enquirySchema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const enquiry = await prisma.enquiry.create({ data: parsed.data });

  if (process.env.RESEND_API_KEY && process.env.ENQUIRY_NOTIFICATION_EMAIL) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "DAMC Website <notifications@damcng.com>",
        to: process.env.ENQUIRY_NOTIFICATION_EMAIL,
        subject: `New enquiry: ${parsed.data.subject ?? "General"}`,
        text: `From: ${parsed.data.name} <${parsed.data.email}>\nPhone: ${parsed.data.phone ?? "—"}\n\n${parsed.data.message}`,
      });
    } catch {
      // Email notification is best-effort; the enquiry is already saved.
    }
  }

  return NextResponse.json({ id: enquiry.id }, { status: 201 });
}
