import * as React from "react";

const INLINE_PATTERN = /(\*\*.+?\*\*|\*.+?\*|_.+?_)/g;

export function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .split(INLINE_PATTERN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
      }
      if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
        return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}

/**
 * Splits plain text typed into an admin textarea into paragraphs on blank
 * lines. A single line break within a paragraph is kept as a line break
 * (via whitespace-pre-line), not treated as a new paragraph - so a list of
 * lines separated by single Enters stays visually together.
 */
export function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Renders plain text as paragraphs (blank-line separated, see splitParagraphs)
 * with bold and italic inline markers (double/single asterisk or underscore).
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  const paragraphs = splitParagraphs(text);

  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={`${className ?? ""} whitespace-pre-line`.trim()}>
          {renderInline(para, String(i))}
        </p>
      ))}
    </>
  );
}
