/**
 * Server actions redirect back to the current page with a one-time flash
 * message in the query string. `<ToastListener>` picks it up on mount, shows
 * it, then strips it from the URL. Works uniformly whether the action would
 * otherwise redirect (e.g. after creating a record) or just revalidate in
 * place (e.g. toggling a status).
 */
export function toastUrl(path: string, message: string, type: "success" | "error" = "success") {
  const params = new URLSearchParams({ toast: message, toastType: type });
  return `${path}?${params.toString()}`;
}
