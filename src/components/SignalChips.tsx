import type { Signals } from "../data/script";

type Props = {
  signals: Signals;
};

type Chip = {
  label: string;
  flagged: boolean;
};

export function SignalChips({ signals }: Props) {
  const chips: Chip[] = [
    { label: "NOVELTY " + signals.novelty, flagged: signals.novelty === "high" },
    { label: "CONSEQUENCE " + signals.consequence, flagged: signals.consequence === "high" },
    { label: "SCOPE " + signals.scope, flagged: signals.scope === "high" },
    {
      label: signals.goalAlignment === "low" ? "GOAL off" : "GOAL fits",
      flagged: signals.goalAlignment === "low",
    },
  ];

  return (
    <div className="chips">
      {chips.map((chip) => (
        <span key={chip.label} className={chip.flagged ? "chip flagged" : "chip"}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}
