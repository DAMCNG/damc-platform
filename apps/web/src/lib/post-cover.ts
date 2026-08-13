export function postCoverImage(post: { coverImageUrl: string | null; photos: { url: string }[] }) {
  return post.photos[0]?.url ?? post.coverImageUrl ?? "/placeholders/post-cover.svg";
}
