import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lifecare Options – Home Health in Katy, TX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Always load the bundled Geist font so ImageResponse always has ≥1 font.
  // Playfair Display is attempted from Google Fonts; if unavailable (offline
  // build sandbox), Geist is the fallback and the build stays green.
  const geistData = await readFile(
    join(
      process.cwd(),
      "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
    ),
  );

  let plusJakartaData: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU79TA.ttf",
      { cache: "force-cache" },
    );
    if (res.ok) {
      plusJakartaData = await res.arrayBuffer();
    }
  } catch {
    // Network unavailable in build sandbox — Geist will cover the layout.
  }

  type FontConfig = {
    name: string;
    data: ArrayBuffer | Buffer;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal" | "italic";
  };

  const fonts: FontConfig[] = [
    { name: "Geist", data: geistData, weight: 400, style: "normal" },
    ...(plusJakartaData
      ? [
          {
            name: "Plus Jakarta Sans",
            data: plusJakartaData,
            weight: 700 as const,
            style: "normal" as const,
          },
        ]
      : []),
  ];

  const titleFont = plusJakartaData
    ? '"Plus Jakarta Sans", Geist, sans-serif'
    : "Geist, sans-serif";

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
          background: "#0F2B47",
          position: "relative",
        }}
      >
        {/* Care-blue accent bar across the top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#5A8BB8",
          }}
        />

        {/* Amber decorative strip at the bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#E5A94E",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Accent rule: care-blue bar + amber dot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 56,
                height: 4,
                borderRadius: 2,
                background: "#5A8BB8",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#E5A94E",
              }}
            />
            <div
              style={{
                width: 56,
                height: 4,
                borderRadius: 2,
                background: "#5A8BB8",
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              fontFamily: titleFont,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            Lifecare Options
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 400,
              fontFamily: "Geist, sans-serif",
              color: "#5A8BB8",
              marginTop: 24,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Home Health · Katy, TX
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
