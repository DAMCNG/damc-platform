import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Dignified Articulate Men's Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1B140F 0%, #332419 100%)",
          padding: 80,
        }}
      >
        <img src={logoSrc} width={140} height={140} style={{ borderRadius: "50%" }} />
        <div
          style={{
            marginTop: 40,
            fontSize: 58,
            fontWeight: 700,
            color: "#F1E8D8",
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          Dignified Articulate Men&apos;s Club
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#E9C46A",
            textAlign: "center",
          }}
        >
          A private membership club in Lagos
        </div>
      </div>
    ),
    { ...size }
  );
}
