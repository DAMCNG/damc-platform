import { PageHeader } from "@/components/page-header";
import { MemberForm } from "@/components/members/member-form";
import { createMember } from "../actions";

export default function NewMemberPage() {
  return (
    <div>
      <PageHeader title="Add member" description="New members appear immediately in the searchable member directory." />
      <MemberForm action={createMember} />
    </div>
  );
}
