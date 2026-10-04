export function formatMemberName(member: { title?: string | null; firstName: string; lastName: string }) {
  return member.title ? `${member.title} ${member.firstName} ${member.lastName}` : `${member.firstName} ${member.lastName}`;
}

export function formatArticulateNumber(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  const match = trimmed.match(/^art\.?\s*(.*)$/i);
  if (match) {
    return `Art. ${match[1].trim()}`;
  }
  const noMatch = trimmed.match(/^no\.?:?\s*(.*)$/i);
  if (noMatch) {
    return `Art. ${noMatch[1].trim()}`;
  }
  return `Art. ${trimmed}`;
}

