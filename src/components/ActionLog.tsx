import { useEffect, useRef } from "react";
import { ANOMALY_ID } from "../data/script";
import { findAction, formatSeconds, stepLabel } from "../logic/format";
import type { LogEntry } from "../state/runReducer";

type Props = {
  log: LogEntry[];
  markAnomaly: boolean; // highlight step 13 once the run is over
};

function outcomeText(entry: LogEntry): string {
  const time = entry.decisionMs === undefined ? "" : " · " + formatSeconds(entry.decisionMs);
  switch (entry.outcome) {
    case "approved":
      return "approved" + time;
    case "rejected":
      return "rejected" + time;
    case "continued":
      return "continued";
    case "approvedAfterReview":
      return "reviewed · approved" + time;
    case "rejectedAfterReview":
      return "reviewed · rejected" + time;
  }
}

function outcomeClass(entry: LogEntry): string {
  if (entry.outcome === "rejected") return "log-outcome muted";
  if (entry.outcome === "continued") return "log-outcome teal";
  if (entry.outcome === "approvedAfterReview" || entry.outcome === "rejectedAfterReview") {
    return "log-outcome amber";
  }
  return "log-outcome";
}

export function ActionLog({ log, markAnomaly }: Props) {
  const listRef = useRef<HTMLOListElement>(null);

  // keep the newest entry in view
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [log.length]);

  return (
    <section className="log-panel" aria-label="Action log">
      <div className="log-header">Action log</div>
      <ol className="log-list" ref={listRef}>
        {log.length === 0 && <li className="log-empty">No actions yet.</li>}
        {log.map((entry) => {
          const action = findAction(entry.actionId);
          const marked = markAnomaly && entry.actionId === ANOMALY_ID;
          return (
            <li key={entry.actionId} className={marked ? "log-entry marked" : "log-entry"}>
              <span className="log-id">{stepLabel(action.id)}</span>
              <span className="log-verb">{action.verb}</span>
              <span className="log-target" title={action.target}>
                {action.target}
              </span>
              <span className={outcomeClass(entry)}>{outcomeText(entry)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
