const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("damc-theme");
    var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // Blocking inline script — runs before hydration so there's never a flash of
  // the wrong theme. Do not move this logic into a regular React effect.
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
