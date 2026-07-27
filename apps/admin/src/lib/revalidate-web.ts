export async function revalidateWebPaths(paths: string[]) {
  const baseUrl = process.env.WEB_APP_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!baseUrl || !secret) return;

  try {
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, paths }),
      cache: "no-store",
    });
  } catch {
    // Best-effort: the public site's own ISR window is the fallback if this fails.
  }
}
