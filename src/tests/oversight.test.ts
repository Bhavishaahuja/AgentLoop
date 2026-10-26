import { describe, expect, it } from "vitest";
import { ANOMALY_ID, SCRIPT } from "../data/script";
import { needsAttention } from "../logic/oversight";

describe("SCRIPT", () => {
  it("has 15 actions with ids 1 to 15 in order", () => {
    expect(SCRIPT).toHaveLength(15);
    for (let i = 0; i < SCRIPT.length; i++) {
      expect(SCRIPT[i].id).toBe(i + 1);
    }
  });
});

describe("needsAttention", () => {
  it("flags action 13 and nothing else", () => {
    for (const action of SCRIPT) {
      expect(needsAttention(action)).toBe(action.id === ANOMALY_ID);
    }
  });
});
