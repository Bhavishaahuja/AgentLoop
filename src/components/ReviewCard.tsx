import { TASK_SHORT } from "../data/script";
import type { AgentAction } from "../data/script";
import type { Decision } from "../state/runReducer";
import { SignalChips } from "./SignalChips";

type Props = {
  action: AgentAction;
  onDecide: (decision: Decision) => void;
};

// Attention Loop: the one time we stop the human. Plain-language reasons only,
// no scores or percentages.
export function ReviewCard({ action, onDecide }: Props) {
  const reasons = action.flagReasons ?? [];

  return (
    <article className="card card-review enter">
      <span className="pill">REVIEW NEEDED</span>
      <h2 className="review-title">Why we're interrupting you</h2>

      <div className="review-action">
        <span className="review-verb">{action.verb}</span> {action.target}
      </div>

      <ul className="reasons">
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <div className="compare">
        <div className="compare-box">
          <div className="compare-label">The task</div>
          <div className="compare-value">{TASK_SHORT}</div>
        </div>
        <div className="compare-box">
          <div className="compare-label">The agent says</div>
          <div className="compare-value">{action.reason}</div>
        </div>
      </div>

      <SignalChips signals={action.signals} />

      <div className="card-actions">
        <button type="button" className="btn btn-primary" onClick={() => onDecide("reject")}>
          REJECT <kbd className="kbd">R</kbd>
        </button>
        <button type="button" className="btn btn-outline" onClick={() => onDecide("approve")}>
          APPROVE ANYWAY <kbd className="kbd">A</kbd>
        </button>
      </div>
    </article>
  );
}
