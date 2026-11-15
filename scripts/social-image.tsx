import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/i18n";
import { ImageResponse } from "next/og.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Post } from "@/lib/posts";
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

const loadAssets = () => Promise.all([
  ogFont("BricolageGrotesque-600.woff"),
  ogFont("Geist-Regular.ttf"),
  ogFont("GeistMono-Regular.ttf"),
  ogLogo(),
]);
type Assets = Awaited<ReturnType<typeof loadAssets>>;
const options = ([bricolage, geist, geistMono]: Assets) => ({
  ...size,
  headers: imageHeaders,
  fonts: [
    { name: "Bricolage Grotesque", data: bricolage, style: "normal" as const, weight: 600 as const },
    { name: "Geist", data: geist, style: "normal" as const, weight: 400 as const },
    { name: "Geist Mono", data: geistMono, style: "normal" as const, weight: 400 as const },
  ],
});

/** A headline card: kicker, headline, footer line and logo. Used by posts and inner pages. */
export async function renderCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const assets = await loadAssets();
  const logo = assets[3];
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "#0B1520", color: "#EEF0EE", padding: "64px 76px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#86C5C0", fontFamily: "Geist Mono", fontSize: 22 }}>
          <div style={{ width: 32, height: 4, background: "#86C5C0" }} />
          {kicker}
        </div>
        <div style={{
          display: "flex", flex: 1, alignItems: "center", fontFamily: "Bricolage Grotesque",
          fontWeight: 600, fontSize: title.length > 65 ? 64 : 74,
          lineHeight: 1.12, letterSpacing: -1,
        }}>
          {title}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid #2C3C4D", paddingTop: 24,
          fontFamily: "Geist", fontSize: 22, color: "#A9B3BC",
        }}>
          <span>{footer}</span>
          <img src={logo} width={220} height={60} style={{ margin: "-12px -8px -12px 0" }} />
        </div>
      </div>
    ),
    options(assets),
  );
}

export async function renderSocialImage(locale: Locale, post: Post | null = null) {
  const t = (source: string) => translate(source, locale);
  if (post) return renderCard({ kicker: `${t("Blog")} / ${SITE_DOMAIN}`, title: post.title, footer: post.date });
  const assets = await loadAssets();
  const logo = assets[3];
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
    options(assets),
  );
}
