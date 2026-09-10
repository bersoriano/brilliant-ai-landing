"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
const services = [
  {
    icon: "search",
    title: "Automation discovery",
    text: "Find the bottlenecks worth fixing. Leave with a prioritized roadmap, a clear scope, and a business case.",
    tag: "Start with the right problem",
  },
  {
    icon: "spark",
    title: "Custom AI agents",
    text: "Purpose-built assistants that extract, classify, and draft. Grounded in your information, guided by your rules.",
    tag: "Intelligence with boundaries",
  },
  {
    icon: "flow",
    title: "Connected workflows",
    text: "Turn disconnected steps into one reliable process. From the first request to the final handoff.",
    tag: "Make the whole process work",
  },
  {
    icon: "plug",
    title: "Integration & ongoing care",
    text: "Connect to your existing stack. Monitor performance, handle exceptions, and improve as your needs change.",
    tag: "Built to keep working",
  },
];
export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="section services-section">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {t("From possibility to production")}
            </span>
            <h2>
              {t("Practical AI.")}
              <br />
              {t("Real work, taken care of.")}
            </h2>
          </div>
          <p>
            {t("Strategy, implementation, and ongoing support.")}
            <br className="desktop-break" />
            {t("One partner to get it working—and keep it that way.")}
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <article key={s.title} className="service-card">
              <div
                className={`service-illustration service-illustration-${i}`}
                aria-hidden="true"
              >
                {i === 0 ? (
                  <>
                    <div className="scan-line" />
                    <div className="scan-row">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="scan-row">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="scan-highlight">
                      <Icon name="search" size={19} />
                      <span>{t("Opportunity identified")}</span>
                      <Icon name="check" size={14} />
                    </div>
                  </>
                ) : i === 1 ? (
                  <>
                    <span className="agent-chip">
                      <Icon name="document" />
                    </span>
                    <span className="agent-connection" />
                    <span className="agent-core">
                      <Icon name="spark" size={32} />
                    </span>
                    <span className="agent-connection" />
                    <span className="agent-chip">
                      <Icon name="check" />
                    </span>
                  </>
                ) : i === 2 ? (
                  <>
                    <span className="flow-pill">{t("Trigger")}</span>
                    <span className="agent-connection" />
                    <span className="flow-pill flow-pill-accent">
                      {t("Process")}
                    </span>
                    <span className="agent-connection" />
                    <span className="flow-pill">
                      {t("Done")} <Icon name="check" size={12} />
                    </span>
                  </>
                ) : (
                  <>
                    <div className="mini-chart">
                      {[25, 43, 36, 55, 48, 63, 71, 64, 82, 95].map((h, n) => (
                        <span key={n} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <span className="monitoring-label">
                      <span className="status-dot" />
                      {t("Continuous improvement")}
                    </span>
                  </>
                )}
              </div>
              <div className="service-text">
                <Icon name={s.icon} size={21} />
                <h3>{t(s.title)}</h3>
                <p>{t(s.text)}</p>
                <span>{t(s.tag)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
