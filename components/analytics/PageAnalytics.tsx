"use client";

/**
 * Mounted once in the root layout. Sends, through `track()`:
 * - page_view once per pathname (initial load included);
 * - section_view once per section per page view;
 * - read_progress (content_type "article") at 25/50/75/100% of a blog body;
 * - cta_click for booking, WhatsApp, business email and inquiry-form links,
 *   classified from the address (`linkProperties`) or a `data-cta` attribute.
 * cta_location: nearest data-cta-location, blog body, data-analytics-section,
 * section/article id, then header/footer/nav.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { type AnalyticsParams, type CtaType, articleProgress, linkProperties, pageProperties, sectionIsVisible } from "@/lib/analytics";
import { analyticsEnabled, track, trackPageView } from "@/lib/analytics.client";

/** Page grouping and locale become GA custom dimensions; blog_slug groups translations. */
function pageParams(href: string): AnalyticsParams {
  const { page_type, locale, blog_slug } = pageProperties(href);
  return { page_type, locale, blog_slug };
}

export function PageAnalytics() {
  const pathname = usePathname();
  const visit = useRef({ path: "", sections: new Set<string>(), milestones: new Set<number>() });

  useEffect(() => {
    if (!analyticsEnabled()) return;
    // Refs survive React Strict Mode's double effect, so dev sends one view too.
    if (visit.current.path !== pathname) {
      visit.current = { path: pathname, sections: new Set(), milestones: new Set() };
      trackPageView(pageParams(window.location.href));
    }
    const state = visit.current;
    let frame = 0;
    // Query on each check: streamed content and locale replacements can arrive
    // after this effect without a new route or a full document navigation.
    function measure() {
      frame = 0;
      if (document.visibilityState === "hidden") return;
      const sections = document.querySelectorAll<HTMLElement>(
        "main section[id], main article[id], [data-analytics-section], [data-analytics-article] h2",
      );
      sections.forEach((section, index) => {
        const id = section.dataset.analyticsSection || section.id || `blog-heading-${index + 1}`;
        if (state.sections.has(id)) return;
        const rect = section.getBoundingClientRect();
        if (sectionIsVisible(rect.top, rect.height, window.innerHeight)) {
          state.sections.add(id);
          track("section_view", { section_id: id });
        }
      });
      const article = document.querySelector("[data-analytics-article]");
      if (article) {
        const rect = article.getBoundingClientRect();
        const progress = articleProgress(rect.top, rect.height, window.innerHeight);
        for (const percent of [25, 50, 75, 100]) {
          if (progress >= percent && !state.milestones.has(percent)) {
            state.milestones.add(percent);
            track("read_progress", { percent, content_type: "article" });
          }
        }
      }
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(measure); }
    function click(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      if (!(event.target instanceof Element)) return;
      const marked = event.target.closest<HTMLElement>("[data-cta]");
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      const cta_type = (marked?.dataset.cta as CtaType | undefined) ?? (link && linkProperties(link.href, window.location.href)?.cta_type);
      if (!cta_type) return;
      const target = marked ?? link!;
      const area = target.closest<HTMLElement>(
        "[data-cta-location], [data-analytics-article], [data-analytics-section], article[id], section[id], header, footer, nav",
      );
      const cta_location = area?.dataset.ctaLocation || area?.dataset.analyticsSection || area?.id ||
        (area?.hasAttribute("data-analytics-article") ? "blog_body" : area?.tagName.toLowerCase()) || "page";
      let link_domain: string | undefined;
      try {
        const url = new URL(link?.href ?? "");
        if (/^https?:$/.test(url.protocol) && url.origin !== window.location.origin) link_domain = url.hostname;
      } catch { /* empty or not a URL */ }
      track("cta_click", { cta_type, cta_location, link_domain });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("click", click, true);
    document.addEventListener("auxclick", click, true);
    const observer = new MutationObserver(schedule);
    const main = document.querySelector("main");
    if (main) observer.observe(main, { childList: true, subtree: true });
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("click", click, true);
      document.removeEventListener("auxclick", click, true);
    };
  }, [pathname]);
  return null;
}
