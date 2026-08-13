export function formatMemberName(member: { title?: string | null; firstName: string; lastName: string }) {
  return member.title ? `${member.title} ${member.firstName} ${member.lastName}` : `${member.firstName} ${member.lastName}`;
}
