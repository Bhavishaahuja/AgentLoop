import { SCRIPT } from "../data/script";
import type { AgentAction } from "../data/script";
import type { Outcome } from "../state/runReducer";
import { SignalChips } from "./SignalChips";

type Props = {
  action: AgentAction;
  outcome: Outcome;
};

// Attention Loop calm card: what the agent just did, no buttons.
// After step 13 is reviewed it stays up briefly with the review result as its tag.
export function RoutineCard({ action, outcome }: Props) {
  let tag = "routine · continued";
  let tagClass = "tag";
  if (outcome === "rejectedAfterReview") {
    tag = "reviewed · rejected";
    tagClass = "tag tag-amber";
  } else if (outcome === "approvedAfterReview") {
    tag = "reviewed · approved";
    tagClass = "tag tag-amber";
  }

  return (
    <article className="card card-routine enter">
      <div className="card-head">
        <div className="eyebrow">
          STEP {action.id} OF {SCRIPT.length}
        </div>
        <span className={tagClass}>{tag}</span>
      </div>
      <div className="verb">{action.verb}</div>
      <div className="target">{action.target}</div>
      <p className="reason">
        <span className="reason-label">Agent's reason:</span> {action.reason}
      </p>
      <SignalChips signals={action.signals} />
    </article>
  );
}
