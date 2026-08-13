import * as React from "react";
import { ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { splitParagraphs, renderInline } from "@/components/formatted-text";

const PHOTO_TOKEN = /^\[photo\]$/i;

function PostPhoto({ url }: { url: string }) {
  return (
    <div className="relative my-6 h-[420px] w-full overflow-hidden rounded-xl2 bg-ink/5 dark:bg-parchment/5 sm:h-[520px]">
      <ImageWithSkeleton src={optimizedImageUrl(url, 1400)} alt="" className="h-full w-full object-contain" />
    </div>
  );
}

/**
 * Renders post content as paragraphs, same rules as FormattedText. Photos are
 * placed wherever the admin types a standalone `[photo]` line in the content
 * (2nd photo where the 2nd token appears, etc). If no tokens are used, every
 * photo is shown up front before the text - the old, simpler behavior, so
 * existing posts written before this feature don't need any changes.
 */
export function PostBody({
  content,
  photoUrls,
  paragraphClassName,
}: {
  content: string;
  photoUrls: string[];
  paragraphClassName?: string;
}) {
  const blocks = splitParagraphs(content);
  const hasTokens = blocks.some((b) => PHOTO_TOKEN.test(b));
  let photoIndex = 0;
  const nodes: React.ReactNode[] = [];

  if (!hasTokens) {
    photoUrls.forEach((url, i) => nodes.push(<PostPhoto key={`photo-${i}`} url={url} />));
  }

  blocks.forEach((block, i) => {
    if (PHOTO_TOKEN.test(block)) {
      const url = photoUrls[photoIndex++];
      if (url) nodes.push(<PostPhoto key={`photo-inline-${i}`} url={url} />);
    } else {
      nodes.push(
        <p key={i} className={`${paragraphClassName ?? ""} whitespace-pre-line`.trim()}>
          {renderInline(block, String(i))}
        </p>
      );
    }
  });

  if (hasTokens) {
    for (; photoIndex < photoUrls.length; photoIndex++) {
      nodes.push(<PostPhoto key={`photo-extra-${photoIndex}`} url={photoUrls[photoIndex]} />);
    }
  }

  return <>{nodes}</>;
}
