import { TASK } from "../data/script";
import type { Mode } from "../state/runReducer";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
};

export function TopBar({ mode, onModeChange, onReset }: Props) {
  return (
    <header className="topbar">
      <div className="brand">THE APPROVAL TRAP</div>

      <div className="task">
        <span className="task-label">TASK</span>
        <span className="task-text">{TASK}</span>
      </div>

      <div className="controls">
        <div className="toggle" role="group" aria-label="Oversight mode">
          <button
            type="button"
            className={mode === "approval" ? "toggle-btn active" : "toggle-btn"}
            aria-pressed={mode === "approval"}
            onClick={() => onModeChange("approval")}
          >
            Approval Loop
          </button>
          <button
            type="button"
            className={mode === "attention" ? "toggle-btn active" : "toggle-btn"}
            aria-pressed={mode === "attention"}
            onClick={() => onModeChange("attention")}
          >
            Attention Loop
          </button>
        </div>
        <button type="button" className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  );
}
