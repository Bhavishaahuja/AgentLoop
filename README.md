# The Approval Trap

Live demo for the talk **"Keep a Human in the Loop"**. One simulated agent runs one fixed script under two oversight modes:

- **Approval Loop:** the human approves every action. After a dozen routine approvals, a bad action (step 13) slips through looking exactly like the others.
- **Attention Loop:** routine actions continue on their own, and the oversight layer stops only for the unusual one, with plain-language reasons.

Offline, deterministic, no backend. Laid out for 1920×1080 and scaled to fit any window.

## Run

```bash
npm install
npm run build && npm run preview   # on stage
npm run dev                        # while editing
npm test
```

## Presenter keys

| Key | Action |
|-----|--------|
| `Space` | Start the run |
| `A` / `R` | Approve / Reject |
| `1` / `2` | Approval Loop / Attention Loop (resets) |
| `0` | Reset the current mode |
| `C` | Oversight check (Attention Loop end screen) |
| `Esc` | Close the oversight check |

## Where things live

- `src/data/script.ts`: the task and the 15 actions
- `src/logic/oversight.ts`: `needsAttention()`, the oversight rule
- `src/state/runReducer.ts`: run state and transitions
- `src/config.ts`: timing constants
