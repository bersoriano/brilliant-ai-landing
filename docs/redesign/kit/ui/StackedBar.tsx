// Destination: components/ui/StackedBar.tsx
// Exhibit 3 chart: one 100%-wide bar split into "handled" (accent) and
// "still with your team" (line-strong). Pure CSS, no chart library.
// Screen readers get one sentence via `summary`; the bar itself is hidden.
export function StackedBar({
  share,
  handledLabel,
  remainingLabel,
  axisEnd,
  summary,
}: {
  /** 0..1 — the automated share */
  share: number;
  handledLabel: string;
  remainingLabel: string;
  /** right-hand axis label, e.g. "50 hrs" */
  axisEnd: string;
  /** e.g. "30 of 50 repetitive hours a week handled by Brilliant" */
  summary: string;
}) {
  const pct = Math.round(Math.min(Math.max(share, 0), 1) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p className="sr-only">{summary}</p>
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          fontSize: 14,
        }}
      >
        <span style={{ color: "var(--accent)" }}>{handledLabel}</span>
        <span style={{ color: "var(--muted)", textAlign: "right" }}>{remainingLabel}</span>
      </div>
      <div aria-hidden="true" style={{ display: "flex", height: 44, gap: 3 }}>
        <div
          style={{
            width: `${pct}%`,
            background: "var(--accent)",
            transition: "width 0.25s ease",
          }}
        />
        <div style={{ flexGrow: 1, background: "var(--line-strong)" }} />
      </div>
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "1px solid var(--line-strong)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--faint)",
        }}
      >
        <span>0</span>
        <span>{axisEnd}</span>
      </div>
    </div>
  );
}
