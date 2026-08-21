const THEME_SCRIPT = `
(function () {
  var isDark = false;
  var stored = null;
  try {
    stored = localStorage.getItem("damc-theme");
  } catch (e) {}
  try {
    isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {}
  document.documentElement.classList.toggle("dark", isDark);
})();
`;

export function ThemeScript() {
  // Blocking inline script — runs before hydration so there's never a flash of
  // the wrong theme. Do not move this logic into a regular React effect.
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
