import type { Config } from "tailwindcss";
import sharedPreset from "@damc/ui/tailwind.preset.js";

const config: Config = {
  presets: [sharedPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
