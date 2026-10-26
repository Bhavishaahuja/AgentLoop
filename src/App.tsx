import { useEffect, useReducer, useState } from "react";
import { AUTO_STEP_MS, THINK_MS } from "./config";
import { SCRIPT } from "./data/script";
import { findAction, plural } from "./logic/format";
import { createRun, runReducer } from "./state/runReducer";
import type { Decision, Mode, RunState } from "./state/runReducer";
import { TopBar } from "./components/TopBar";
import { IdleScreen } from "./components/IdleScreen";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { ActionCard } from "./components/ActionCard";
import { RoutineCard } from "./components/RoutineCard";
import { ReviewCard } from "./components/ReviewCard";
import { ActionLog } from "./components/ActionLog";
import { ApprovalEndScreen } from "./components/ApprovalEndScreen";
import { AttentionEndScreen } from "./components/AttentionEndScreen";
import { CalibrationCheck } from "./components/CalibrationCheck";

// The whole app is laid out at 1920x1080 and scaled to fit the window,
// so the projector and a laptop show the exact same layout.
const FRAME_W = 1920;
const FRAME_H = 1080;

function computeScale(): number {
  return Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H);
}

function useFrameScale(): number {
  const [scale, setScale] = useState(computeScale);
  useEffect(() => {
    const onResize = () => setScale(computeScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

function StatusLine({ state }: { state: RunState }) {
  let checked = state.log.length;
  let surfaced = 0;
  for (const entry of state.log) {
    if (entry.decisionMs !== undefined) surfaced++;
  }
  // the action we're paused on has been checked and surfaced too
  if (state.phase === "reviewNeeded") {
    checked++;
    surfaced++;
  }
  return (
    <div className="status-line">
      Oversight layer: <strong>{plural(checked, "action")}</strong> checked ·{" "}
      <strong className={surfaced > 0 ? "amber" : ""}>{surfaced}</strong> surfaced
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(runReducer, "approval", (mode: Mode) => createRun(mode));
  const scale = useFrameScale();

  // Approval Loop: short "thinking" pause, then show the card
  useEffect(() => {
    if (state.phase !== "thinking") return;
    const runId = state.runId;
    const timer = window.setTimeout(() => {
      dispatch({ type: "SHOW_CARD", now: performance.now(), runId });
    }, THINK_MS);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.stepIndex, state.runId]);

  // Attention Loop: tick through the script on its own
  useEffect(() => {
    if (state.phase !== "autoRunning") return;
    const runId = state.runId;
    // the first action shows up a bit sooner so the stage isn't empty for long
    const delay = state.stepIndex === 0 ? THINK_MS : AUTO_STEP_MS;
    const timer = window.setTimeout(() => {
      dispatch({ type: "AUTO_STEP", now: performance.now(), runId });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.stepIndex, state.runId]);

  // Presenter keys. The reducer ignores anything that doesn't fit the current
  // phase, so this handler doesn't need to know the state.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      // Space must never "click" a focused button or scroll the page
      if (event.key === " ") event.preventDefault();
      if (event.repeat) return;

      const key = event.key.toLowerCase();
      if (key === " ") {
        dispatch({ type: "START" });
      } else if (key === "a") {
        dispatch({ type: "DECIDE", decision: "approve", now: performance.now() });
      } else if (key === "r") {
        dispatch({ type: "DECIDE", decision: "reject", now: performance.now() });
      } else if (key === "1") {
        dispatch({ type: "SET_MODE", mode: "approval" });
      } else if (key === "2") {
        dispatch({ type: "SET_MODE", mode: "attention" });
      } else if (key === "0") {
        dispatch({ type: "RESET" });
      } else if (key === "c") {
        dispatch({ type: "OPEN_CALIBRATION" });
      } else if (key === "escape") {
        dispatch({ type: "CLOSE_CALIBRATION" });
      }
    }

    // buttons fire their click on Space keyup, so block that too
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === " ") event.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
    };
  }, []);

  function decide(decision: Decision) {
    dispatch({ type: "DECIDE", decision, now: performance.now() });
  }

  function renderStage() {
    if (state.phase === "idle") {
      return <IdleScreen mode={state.mode} onStart={() => dispatch({ type: "START" })} />;
    }

    if (state.phase === "finished") {
      if (state.mode === "approval") return <ApprovalEndScreen log={state.log} />;
      return (
        <AttentionEndScreen
          log={state.log}
          onOpenCheck={() => dispatch({ type: "OPEN_CALIBRATION" })}
        />
      );
    }

    const current = SCRIPT[state.stepIndex];

    if (state.mode === "approval") {
      if (state.phase === "thinking") return <ThinkingIndicator />;
      return <ActionCard key={current.id} action={current} onDecide={decide} />;
    }

    if (state.phase === "reviewNeeded") {
      return <ReviewCard key={current.id} action={current} onDecide={decide} />;
    }

    // autoRunning: show whatever the agent did last
    const last = state.log[state.log.length - 1];
    if (!last) return <ThinkingIndicator />;
    return <RoutineCard key={last.actionId} action={findAction(last.actionId)} outcome={last.outcome} />;
  }

  const showStatus = state.mode === "attention" && state.phase !== "idle";

  return (
    <div className="viewport">
      <div
        className="frame"
        style={{ width: FRAME_W, height: FRAME_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <TopBar
          mode={state.mode}
          onModeChange={(mode) => dispatch({ type: "SET_MODE", mode })}
          onReset={() => dispatch({ type: "RESET" })}
        />

        <main className="main">
          <div className="stage">
            {showStatus && <StatusLine state={state} />}
            <div className="stage-area">{renderStage()}</div>
          </div>
          <ActionLog log={state.log} markAnomaly={state.phase === "finished"} />
        </main>

        {state.calibrationOpen && (
          <CalibrationCheck onClose={() => dispatch({ type: "CLOSE_CALIBRATION" })} />
        )}
      </div>
    </div>
  );
}
