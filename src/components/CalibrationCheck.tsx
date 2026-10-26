import { useState } from "react";
import { ANOMALY_ID } from "../data/script";
import { findAction, stepLabel } from "../logic/format";

type Props = {
  onClose: () => void;
};

// fixed order on purpose so it plays the same every time
const CHECK_IDS = [3, 13, 6, 12, 9];

export function CalibrationCheck({ onClose }: Props) {
  const [pickedId, setPickedId] = useState<number | null>(null);
  const locked = pickedId !== null;

  let message = "";
  if (pickedId === ANOMALY_ID) {
    message =
      "Correct. This one left the established workflow: a destination the agent had never used.";
  } else if (pickedId !== null) {
    message =
      "Not quite. Look at step 13: it sent all vendor contacts to a domain the agent had never used.";
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Oversight check">
      <div className="check-panel enter">
        <div className="eyebrow">OVERSIGHT CHECK</div>
        <h2 className="check-question">
          Here are 5 recent agent actions. Which one would you investigate?
        </h2>

        <div className="check-rows">
          {CHECK_IDS.map((id) => {
            const action = findAction(id);
            let className = "check-row";
            if (locked && id === ANOMALY_ID) className += " revealed";
            if (locked && id === pickedId && id !== ANOMALY_ID) className += " picked";
            return (
              <button
                key={id}
                type="button"
                className={className}
                disabled={locked}
                onClick={() => setPickedId(id)}
              >
                <span className="check-id">{stepLabel(id)}</span>
                <span className="check-verb">{action.verb}</span>
                <span className="check-target">
                  {/* wrap only at spaces, never inside "ext-share" */}
                  {action.target.split(" ").map((word, i) => (
                    <span key={i} className="nowrap">
                      {i > 0 ? " " : ""}
                      {word}
                    </span>
                  ))}
                </span>
                {locked && id === pickedId && <span className="check-pick">your pick</span>}
              </button>
            );
          })}
        </div>

        {locked && <p className="check-message">{message}</p>}

        <div className="check-footer">
          <button type="button" className="btn btn-outline btn-small" onClick={onClose}>
            Close <kbd className="kbd">Esc</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
