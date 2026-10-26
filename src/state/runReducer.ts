import { SCRIPT } from "../data/script";
import { needsAttention } from "../logic/oversight";

export type Mode = "approval" | "attention";

export type Phase =
  | "idle"              // waiting for Space / Start
  | "thinking"          // Approval Loop: short pause before the next card
  | "awaitingDecision"  // Approval Loop: card shown, waiting for A / R
  | "autoRunning"       // Attention Loop: routine actions flowing on their own
  | "reviewNeeded"      // Attention Loop: paused on a surfaced action
  | "finished";

export type Outcome =
  | "approved"
  | "rejected"
  | "continued"               // Attention Loop: routine, no human needed
  | "approvedAfterReview"
  | "rejectedAfterReview";

export type LogEntry = {
  actionId: number;
  outcome: Outcome;
  decisionMs?: number;  // only when a human actually decided
};

export type RunState = {
  mode: Mode;
  phase: Phase;
  stepIndex: number;      // index into SCRIPT of the current action
  log: LogEntry[];
  shownAt: number | null; // performance.now() when the current card appeared
  calibrationOpen: boolean;
  runId: number;          // bumps on every start/reset so a late timer can't touch a new run
};

export type Decision = "approve" | "reject";

export type RunAction =
  | { type: "START" }
  | { type: "SHOW_CARD"; now: number; runId: number }
  | { type: "AUTO_STEP"; now: number; runId: number }
  | { type: "DECIDE"; decision: Decision; now: number }
  | { type: "RESET" }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "OPEN_CALIBRATION" }
  | { type: "CLOSE_CALIBRATION" };

export function createRun(mode: Mode, runId = 0): RunState {
  return {
    mode,
    phase: "idle",
    stepIndex: 0,
    log: [],
    shownAt: null,
    calibrationOpen: false,
    runId,
  };
}

// log the current action and move on to the next one (or finish)
function advance(state: RunState, entry: LogEntry, nextPhase: Phase): RunState {
  const nextIndex = state.stepIndex + 1;
  const finished = nextIndex >= SCRIPT.length;
  return {
    ...state,
    log: [...state.log, entry],
    stepIndex: nextIndex,
    phase: finished ? "finished" : nextPhase,
    shownAt: null,
  };
}

function decisionTime(state: RunState, now: number): number {
  if (state.shownAt === null) return 0;
  return Math.max(0, now - state.shownAt);
}

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case "START": {
      if (state.phase !== "idle") return state;
      const firstPhase: Phase = state.mode === "approval" ? "thinking" : "autoRunning";
      return { ...createRun(state.mode, state.runId + 1), phase: firstPhase };
    }

    case "SHOW_CARD": {
      if (action.runId !== state.runId) return state;
      if (state.phase !== "thinking") return state;
      return { ...state, phase: "awaitingDecision", shownAt: action.now };
    }

    case "AUTO_STEP": {
      if (action.runId !== state.runId) return state;
      if (state.phase !== "autoRunning") return state;

      const current = SCRIPT[state.stepIndex];
      if (needsAttention(current)) {
        // stop and ask the human; it only goes in the log once they decide
        return { ...state, phase: "reviewNeeded", shownAt: action.now };
      }
      return advance(state, { actionId: current.id, outcome: "continued" }, "autoRunning");
    }

    case "DECIDE": {
      const current = SCRIPT[state.stepIndex];
      const decisionMs = decisionTime(state, action.now);

      if (state.phase === "awaitingDecision") {
        const outcome: Outcome = action.decision === "approve" ? "approved" : "rejected";
        return advance(state, { actionId: current.id, outcome, decisionMs }, "thinking");
      }
      if (state.phase === "reviewNeeded") {
        const outcome: Outcome =
          action.decision === "approve" ? "approvedAfterReview" : "rejectedAfterReview";
        return advance(state, { actionId: current.id, outcome, decisionMs }, "autoRunning");
      }
      return state;
    }

    case "RESET":
      return createRun(state.mode, state.runId + 1);

    case "SET_MODE":
      return createRun(action.mode, state.runId + 1);

    case "OPEN_CALIBRATION": {
      if (state.mode !== "attention" || state.phase !== "finished") return state;
      return { ...state, calibrationOpen: true };
    }

    case "CLOSE_CALIBRATION": {
      if (!state.calibrationOpen) return state;
      return { ...state, calibrationOpen: false };
    }
  }
}
