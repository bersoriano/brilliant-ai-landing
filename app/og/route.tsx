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
// Horizontal logo, white lettering (880×240, ~15% clear space top and bottom).
const ogLogo = () =>
  readFile(join(process.cwd(), "public/brand/brilliant-horizontal-on-dark-880w.png")).then(
    (png) => `data:image/png;base64,${png.toString("base64")}`,
  );

export async function GET(request: Request) {
  const locale = await getRequestLocale();
  const t = (source: string) => translate(source, locale);
  const slug = new URL(request.url).searchParams.get("post");
  const post = slug ? await getPost(slug, locale) : null;
  if (slug && !post) return new Response("Not found", { status: 404 });
  const [bricolage, geist, geistMono, logo] = await Promise.all([
    ogFont("BricolageGrotesque-600.woff"),
    ogFont("Geist-Regular.ttf"),
    ogFont("GeistMono-Regular.ttf"),
    ogLogo(),
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
            display: "flex", flex: 1, alignItems: "center", fontFamily: "Bricolage Grotesque",
            fontWeight: 600, fontSize: post.title.length > 65 ? 64 : 74,
            lineHeight: 1.12, letterSpacing: -1,
          }}>
            {post.title}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: "1px solid #2C3C4D", paddingTop: 24,
            fontFamily: "Geist", fontSize: 22, color: "#A9B3BC",
          }}>
            <span>{post.date}</span>
            <img src={logo} width={220} height={60} style={{ margin: "-12px -8px -12px 0" }} />
          </div>
        </div>
      ),
      {
        ...size,
        headers: imageHeaders,
        fonts: [
          { name: "Bricolage Grotesque", data: bricolage, style: "normal", weight: 600 },
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
          <span style={{ fontFamily: "Bricolage Grotesque", fontWeight: 600 }}>
            {t("The capacity of a bigger team.")}
          </span>
          <span
            style={{
              fontFamily: "Bricolage Grotesque",
              fontWeight: 600,
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
            alignItems: "center",
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
          <img src={logo} width={220} height={60} style={{ margin: "-12px -8px -12px 0" }} />
        </div>
      </div>
    ),
    {
      ...size,
      headers: imageHeaders,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage, style: "normal", weight: 600 },
        { name: "Geist", data: geist, style: "normal", weight: 400 },
        { name: "Geist Mono", data: geistMono, style: "normal", weight: 400 },
      ],
    },
  );
}
