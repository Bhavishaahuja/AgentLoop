import type { Mode } from "../state/runReducer";

type Props = {
  mode: Mode;
  onStart: () => void;
};

export function IdleScreen({ mode, onStart }: Props) {
  let title = "Approval Loop";
  let subtitle = "Every action needs your approval.";
  if (mode === "attention") {
    title = "Attention Loop";
    subtitle =
      "Routine actions continue on their own. You're asked only when something deserves a look.";
  }

  return (
    <div className="idle enter">
      <h1 className="idle-title">{title}</h1>
      <p className="idle-subtitle">{subtitle}</p>
      <button type="button" className="btn btn-primary" onClick={onStart}>
        Start run <kbd className="kbd">Space</kbd>
      </button>
    </div>
  );
}
