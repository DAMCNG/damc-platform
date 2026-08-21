export async function revalidateWebPaths(paths: string[]) {
  const baseUrl = process.env.WEB_APP_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!baseUrl || !secret) return;

  try {
    // Bounded: a slow or unreachable web app (cold start, wrong URL, DNS
    // failure) can otherwise hang this fetch for a long time, and since every
    // admin action awaits this before its redirect, that shows up as a
    // save/delete button spinning indefinitely even though the database
    // write already succeeded. The public site's own ISR window is the
    // fallback either way, so failing fast here costs nothing.
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, paths }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Best-effort: the public site's own ISR window is the fallback if this fails.
  }
}
