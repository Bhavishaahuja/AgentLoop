import { SCRIPT } from "../data/script";
import type { AgentAction } from "../data/script";
import type { Decision } from "../state/runReducer";

type Props = {
  action: AgentAction;
  onDecide: (decision: Decision) => void;
};

// Approval Loop pending card. Every action, step 13 included, renders through
// exactly this markup and styling. Only the text changes.
export function ActionCard({ action, onDecide }: Props) {
  return (
    <article className="card enter">
      <div className="eyebrow">
        STEP {action.id} OF {SCRIPT.length}
      </div>
      <div className="verb">{action.verb}</div>
      <div className="target">{action.target}</div>
      <p className="reason">
        <span className="reason-label">Agent's reason:</span> {action.reason}
      </p>
      <div className="card-actions">
        <button type="button" className="btn btn-primary" onClick={() => onDecide("approve")}>
          APPROVE <kbd className="kbd">A</kbd>
        </button>
        <button type="button" className="btn btn-outline" onClick={() => onDecide("reject")}>
          REJECT <kbd className="kbd">R</kbd>
        </button>
      </div>
    </article>
  );
}
