import { getRequestLocale } from "@/lib/locale.server";
import { translate } from "@/lib/i18n";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPost } from "@/lib/posts.server";
import { SITE_DOMAIN } from "@/lib/site";

const size = { width: 1200, height: 630 };
const imageHeaders = { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" };
const ogFont = (file: string) =>
  readFile(join(process.cwd(), "public/fonts/og", file));

export async function GET(request: Request) {
  const locale = await getRequestLocale();
  const t = (source: string) => translate(source, locale);
  const slug = new URL(request.url).searchParams.get("post");
  const post = slug ? await getPost(slug, locale) : null;
  if (slug && !post) return new Response("Not found", { status: 404 });
  const [bodoni, bodoniItalic, geist, geistMono] = await Promise.all([
    ogFont("BodoniModa-500.woff"),
    ogFont("BodoniModa-400-Italic.woff"),
    ogFont("Geist-Regular.ttf"),
    ogFont("GeistMono-Regular.ttf"),
  ]);
  if (post) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#0B1520", color: "#EEF0EE", padding: "64px 76px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#86C5C0", fontFamily: "Geist Mono", fontSize: 22 }}>
            <div style={{ width: 32, height: 4, background: "#86C5C0" }} />
            {t("Blog")} / {SITE_DOMAIN}
          </div>
          <div style={{
            display: "flex", flex: 1, alignItems: "center", fontFamily: "Bodoni Moda",
            fontWeight: 500, fontSize: post.title.length > 65 ? 64 : 74,
            lineHeight: 1.12, letterSpacing: -1,
          }}>
            {post.title}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            borderTop: "1px solid #2C3C4D", paddingTop: 24,
            fontFamily: "Geist", fontSize: 22, color: "#A9B3BC",
          }}>
            <span>{post.date}</span>
            <span style={{ fontFamily: "Bodoni Moda", fontSize: 32, color: "#EEF0EE" }}>Brilliant AI.</span>
          </div>
        </div>
      ),
      {
        ...size,
        headers: imageHeaders,
        fonts: [
          { name: "Bodoni Moda", data: bodoni, style: "normal", weight: 500 },
          { name: "Geist", data: geist, style: "normal", weight: 400 },
          { name: "Geist Mono", data: geistMono, style: "normal", weight: 400 },
        ],
      },
    );
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0B1520",
          color: "#EEF0EE",
          padding: "64px 76px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 32, height: 4, background: "#86C5C0" }} />
          <span
            style={{
              marginTop: 18,
              fontFamily: "Geist Mono",
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#86C5C0",
            }}
          >
            {t("AI automation for finance and healthcare")}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 44,
            fontSize: locale === "es" ? 82 : 104,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          <span style={{ fontFamily: "Bodoni Moda", fontWeight: 500 }}>
            {t("The capacity of a bigger team.")}
          </span>
          <span
            style={{
              fontFamily: "Bodoni Moda",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#86C5C0",
            }}
          >
            {t("Without the hiring.")}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid #2C3C4D",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "Geist",
            fontSize: 22,
            color: "#A9B3BC",
          }}
        >
          <span>
            {locale === "es"
              ? "IA para finanzas y salud en México, EE. UU. y Canadá"
              : "AI for finance & healthcare in the US, Canada & Mexico"}
          </span>
          <span
            style={{
              fontFamily: "Bodoni Moda",
              fontStyle: "italic",
              fontSize: 30,
              color: "#EEF0EE",
            }}
          >
            Brilliant AI<span style={{ color: "#86C5C0", fontStyle: "normal" }}>.</span>
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      headers: imageHeaders,
      fonts: [
        { name: "Bodoni Moda", data: bodoni, style: "normal", weight: 500 },
        { name: "Bodoni Moda", data: bodoniItalic, style: "italic", weight: 400 },
        { name: "Geist", data: geist, style: "normal", weight: 400 },
        { name: "Geist Mono", data: geistMono, style: "normal", weight: 400 },
      ],
    },
  );
}
