import type { AgentAction } from "../data/script";

// The oversight layer: is this action worth a human's attention?
// Kept simple and readable on purpose, since someone may ask about it on stage.
// The signals themselves are hand-set in the script, not computed.
export function needsAttention(action: AgentAction): boolean {
  const signals = action.signals;

  if (signals.novelty === "high") return true;
  if (signals.consequence === "high") return true;
  if (signals.scope === "high") return true;
  if (signals.goalAlignment === "low") return true;

  return false;
}
