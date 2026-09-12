"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CALCULATOR_ANCHOR } from "@/lib/site";
import { Icon } from "../ui/Icon";

const painCards = [
  {
    icon: "chart",
    title: "The report rebuilt every Monday",
    body: "Someone sharp spends the first morning of every week copying numbers into the same deck. Then does it again next Monday.",
  },
  {
    icon: "flow",
    title: "The data moved between tabs",
    body: "Export here, clean it there, paste it in, check it twice. Hours a week moving information a system could move in seconds.",
  },
  {
    icon: "people",
    title: "The process that breaks when it’s busy",
    body: "It works fine until three arrive at once. Then the process that lives in one person’s head starts dropping things.",
  },
];

export function Problem() {
  const { t } = useLanguage();
  return (
    <section id="problem" className="section shell problem-section">
      <div className="problem-intro">
        <span className="eyebrow">{t("The busywork trap")}</span>
        <h2>{t("Remember the deal you turned down.")}</h2>
        <p className="problem-lead">
          {t(
            "Not because you couldn’t win it. The work was there. The demand was there. You said no because your team was already at the ceiling—and your best people were buried in work a system should have handled.",
          )}
        </p>
        <p className="problem-lead">
          {t(
            "That ceiling isn’t rare. It shows up wherever the same manual steps repeat, week after week:",
          )}
        </p>
      </div>
      <div className="problem-cards">
        {painCards.map((card) => (
          <article key={card.title} className="problem-card">
            <span className="problem-card-icon">
              <Icon name={card.icon} size={21} />
            </span>
            <h3>{t(card.title)}</h3>
            <p>{t(card.body)}</p>
          </article>
        ))}
      </div>
      <div className="problem-closer">
        <p>
          {t(
            "None of this is a people problem. The work holding your team back is exactly the work a system was built to carry.",
          )}
        </p>
        <a href={CALCULATOR_ANCHOR} className="text-link">
          {t("Put a number on it")} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}
