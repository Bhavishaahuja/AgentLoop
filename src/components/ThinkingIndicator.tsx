export function ThinkingIndicator() {
  return (
    <div className="thinking" aria-live="polite">
      Agent is working
      <span className="dots" aria-hidden="true">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
}
