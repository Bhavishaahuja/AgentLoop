import { describe, expect, it } from "vitest";
import { ANOMALY_ID } from "../data/script";
import { createRun, runReducer } from "../state/runReducer";
import type { RunState } from "../state/runReducer";

// walks a full Approval Loop run, approving everything
function runApprovalToEnd(): RunState {
  let state = runReducer(createRun("approval"), { type: "START" });
  let now = 0;
  let guard = 0;
  while (state.phase !== "finished" && guard < 100) {
    now += 1000;
    if (state.phase === "thinking") {
      state = runReducer(state, { type: "SHOW_CARD", now, runId: state.runId });
    } else if (state.phase === "awaitingDecision") {
      // decide 2 seconds after the card appeared
      state = runReducer(state, { type: "DECIDE", decision: "approve", now: (state.shownAt ?? 0) + 2000 });
    }
    guard++;
  }
  return state;
}

describe("runReducer, Approval Loop", () => {
  it("approving all 15 ends in finished with 15 approved entries", () => {
    const state = runApprovalToEnd();
    expect(state.phase).toBe("finished");
    expect(state.log).toHaveLength(15);
    for (const entry of state.log) {
      expect(entry.outcome).toBe("approved");
      expect(entry.decisionMs).toBe(2000);
    }
  });

  it("ignores decisions outside a decision phase", () => {
    const thinking = runReducer(createRun("approval"), { type: "START" });
    const after = runReducer(thinking, { type: "DECIDE", decision: "approve", now: 5 });
    expect(after).toBe(thinking);
  });
});

describe("runReducer, Attention Loop", () => {
  it("runs 14 actions on its own and pauses exactly once, at step 13", () => {
    let state = runReducer(createRun("attention"), { type: "START" });
    let pauses = 0;
    let now = 0;
    let guard = 0;
    while (state.phase !== "finished" && guard < 100) {
      now += 1200;
      if (state.phase === "autoRunning") {
        state = runReducer(state, { type: "AUTO_STEP", now, runId: state.runId });
        if (state.phase === "reviewNeeded") {
          pauses++;
          expect(state.stepIndex + 1).toBe(ANOMALY_ID);
        }
      } else if (state.phase === "reviewNeeded") {
        state = runReducer(state, { type: "DECIDE", decision: "reject", now: (state.shownAt ?? 0) + 3100 });
      }
      guard++;
    }

    expect(state.phase).toBe("finished");
    expect(pauses).toBe(1);

    const continued = state.log.filter((entry) => entry.outcome === "continued");
    const reviewed = state.log.filter((entry) => entry.outcome === "rejectedAfterReview");
    expect(continued).toHaveLength(14);
    expect(reviewed).toHaveLength(1);
    expect(reviewed[0].actionId).toBe(ANOMALY_ID);
    expect(reviewed[0].decisionMs).toBe(3100);
  });
});

describe("runReducer, reset", () => {
  it("returns to idle with an empty log from any phase", () => {
    const states: RunState[] = [];

    // collect one state per phase across both modes
    let approval = runReducer(createRun("approval"), { type: "START" });
    states.push(approval); // thinking
    approval = runReducer(approval, { type: "SHOW_CARD", now: 0, runId: approval.runId });
    states.push(approval); // awaitingDecision
    states.push(runApprovalToEnd()); // finished

    let attention = runReducer(createRun("attention"), { type: "START" });
    states.push(attention); // autoRunning
    // 12 routine steps continue, the 13th tick pauses for review
    for (let i = 0; i < 13; i++) {
      attention = runReducer(attention, { type: "AUTO_STEP", now: i, runId: attention.runId });
    }
    states.push(attention); // reviewNeeded
    expect(attention.phase).toBe("reviewNeeded");

    for (const state of states) {
      const reset = runReducer(state, { type: "RESET" });
      expect(reset.phase).toBe("idle");
      expect(reset.log).toHaveLength(0);
      expect(reset.mode).toBe(state.mode);
    }
  });

  it("drops timer actions from a run that was reset", () => {
    const running = runReducer(createRun("approval"), { type: "START" });
    const staleRunId = running.runId;
    const restarted = runReducer(runReducer(running, { type: "RESET" }), { type: "START" });

    const after = runReducer(restarted, { type: "SHOW_CARD", now: 1, runId: staleRunId });
    expect(after).toBe(restarted);
    expect(after.phase).toBe("thinking");
  });

  it("switching mode resets to idle in the new mode", () => {
    const running = runReducer(createRun("approval"), { type: "START" });
    const switched = runReducer(running, { type: "SET_MODE", mode: "attention" });
    expect(switched.mode).toBe("attention");
    expect(switched.phase).toBe("idle");
    expect(switched.log).toHaveLength(0);
  });
});
