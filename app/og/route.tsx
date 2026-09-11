import { getRequestLocale } from "@/lib/locale.server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const size = { width: 1200, height: 630 };

export async function GET() {
  const es = (await getRequestLocale()) === "es";
  const font = await readFile(
    join(process.cwd(), "public/fonts/manrope-regular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#151815",
          color: "#f2f3eb",
          padding: "64px 76px",
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            color: "#ff8a57",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path
              d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z"
              fill="#ff8a57"
            />
          </svg>
          <span style={{ color: "#f2f3eb", marginLeft: 14 }}>brilliant ai.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 52,
            fontSize: 76,
            lineHeight: 1.12,
            letterSpacing: -4,
            flexDirection: "column",
          }}
        >
          <span>{es ? "IA que te libera del" : "AI that takes busywork"}</span>
          <span>{es ? "trabajo repetitivo." : "off your plate."}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            paddingTop: 27,
            borderTop: "1px solid #454c3e",
            justifyContent: "space-between",
            fontSize: es ? 18 : 22,
            color: "#b4bdab",
          }}
        >
          <span>
            {es
              ? "IA para finanzas y salud en México, EE. UU. y Canadá"
              : "AI for finance & healthcare in the US, Canada & Mexico"}
          </span>
          <span style={{ color: "#ff8a57" }}>
            {es
              ? "Más espacio para tu mejor trabajo."
              : "Make room for brilliant work."}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Manrope", data: font, style: "normal", weight: 400 }],
    },
  );
}
