import { notFound } from "next/navigation";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { MemberForm } from "@/components/members/member-form";
import { MemberBusinessesPanel } from "@/components/members/member-businesses-panel";
import { updateMember } from "../actions";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id }, include: { businesses: true } });
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${member.firstName} ${member.lastName}`} />
      <MemberForm member={member} action={updateMember} />
      <MemberBusinessesPanel memberId={member.id} businesses={member.businesses} />
    </div>
  );
}
