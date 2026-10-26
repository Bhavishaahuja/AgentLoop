import { SCRIPT } from "../data/script";
import type { AgentAction } from "../data/script";

// "#04"
export function stepLabel(id: number): string {
  return "#" + String(id).padStart(2, "0");
}

// 2412 -> "2.4s"
export function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1) + "s";
}

export function findAction(id: number): AgentAction {
  for (const action of SCRIPT) {
    if (action.id === id) return action;
  }
  throw new Error("No action with id " + id);
}

// "1 action", "9 actions"
export function plural(count: number, word: string): string {
  return count + " " + word + (count === 1 ? "" : "s");
}
