import { ANOMALY_ID } from "../data/script";
import { formatSeconds, plural, stepLabel } from "../logic/format";
import type { LogEntry } from "../state/runReducer";

type Props = {
  log: LogEntry[];
  onOpenCheck: () => void;
};

export function AttentionEndScreen({ log, onOpenCheck }: Props) {
  let continuedCount = 0;
  let surfacedCount = 0;
  let decisionCount = 0;
  for (const entry of log) {
    if (entry.outcome === "continued") continuedCount++;
    if (entry.outcome === "approvedAfterReview" || entry.outcome === "rejectedAfterReview") {
      surfacedCount++;
    }
    if (entry.decisionMs !== undefined) decisionCount++;
  }

  return (
    <div className="end enter">
      <h2 className="end-headline end-headline-stack">
        <span>{plural(continuedCount, "action")} continued on their own.</span>
        <span className="amber">{surfacedCount} surfaced for review.</span>
        <span>{plural(decisionCount, "human decision")}.</span>
      </h2>

      {/* the whole run at a glance, one cell per step */}
      <div>
        <div className="section-label">Full run</div>
        <ol className="strip">
          {log.map((entry) => {
            const surfaced = entry.decisionMs !== undefined;
            return (
              <li key={entry.actionId} className={surfaced ? "strip-cell surfaced" : "strip-cell"}>
                <span className="strip-block" />
                <span className="strip-label">{stepLabel(entry.actionId)}</span>
              </li>
            );
          })}
        </ol>
        <div className="strip-legend">
          <span className="teal">■ continued</span>
          {log
            .filter((entry) => entry.actionId === ANOMALY_ID)
            .map((entry) => (
              <span key={entry.actionId} className="amber">
                ■ {stepLabel(entry.actionId)} reviewed ·{" "}
                {entry.outcome === "rejectedAfterReview" ? "rejected" : "approved"} ·{" "}
                {formatSeconds(entry.decisionMs ?? 0)}
              </span>
            ))}
        </div>
      </div>

      <div>
        <button type="button" className="btn btn-outline" onClick={onOpenCheck}>
          Run oversight check <kbd className="kbd">C</kbd>
        </button>
      </div>
    </div>
  );
}
