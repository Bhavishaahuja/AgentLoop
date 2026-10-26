import { SPEED_BAR_CAP_S } from "../config";
import { ANOMALY_ID, SCRIPT } from "../data/script";
import { findAction, formatSeconds } from "../logic/format";
import type { LogEntry } from "../state/runReducer";

type Props = {
  log: LogEntry[];
};

const BAR_MAX_PX = 220;

export function ApprovalEndScreen({ log }: Props) {
  let approvedCount = 0;
  for (const entry of log) {
    if (entry.outcome === "approved") approvedCount++;
  }

  const anomaly = findAction(ANOMALY_ID);
  const anomalyEntry = log.find((entry) => entry.actionId === ANOMALY_ID);

  let verdict = "You rejected it.";
  if (anomalyEntry && anomalyEntry.outcome === "approved") {
    verdict = "You approved it in " + formatSeconds(anomalyEntry.decisionMs ?? 0) + ".";
  }

  return (
    <div className="end enter">
      <h2 className="end-headline">
        {approvedCount} of {SCRIPT.length} actions human-approved
      </h2>

      <div>
        <div className="section-label">Time per decision</div>
        <div className="bars">
          {log.map((entry) => {
            const seconds = (entry.decisionMs ?? 0) / 1000;
            const capped = Math.min(seconds, SPEED_BAR_CAP_S);
            const height = Math.max(4, (capped / SPEED_BAR_CAP_S) * BAR_MAX_PX);
            const isTrap = entry.actionId === ANOMALY_ID;
            return (
              <div key={entry.actionId} className="bar-col">
                <span className={isTrap ? "bar-value amber" : "bar-value"}>
                  {seconds.toFixed(1)}s
                </span>
                <div className={isTrap ? "bar trap" : "bar"} style={{ height }} />
                <span className={isTrap ? "bar-label amber" : "bar-label"}>{entry.actionId}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="highlight">
        <div className="highlight-title">
          Step {anomaly.id}: {anomaly.verb}
          <span className="highlight-target">{anomaly.target}</span>
        </div>
        <p className="highlight-body">
          This sent every vendor contact to an outside domain. Nothing in the task asked for it.
        </p>
        <p className="highlight-verdict">{verdict}</p>
      </div>

      <div className="hint">
        Press <kbd className="kbd">2</kbd> for the Attention Loop
      </div>
    </div>
  );
}
