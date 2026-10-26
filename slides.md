---
theme: default
title: The Approval Trap
info: |
  Keep a human in the loop... but keep the human capable of noticing when the loop breaks.
  Bhavisha Ahuja, AI Engineer
colorSchema: dark
fonts:
  sans: Inter
  mono: JetBrains Mono
transition: fade
layout: default
---

<Counter n="1" />

<div class="center-stack">
  <div class="kicker">Act 1 · You, me, and the loop</div>
  <div class="big">I click <span class="approve-btn" style="font-size:2.6rem;padding:0.2rem 1.4rem;vertical-align:middle">Approve</span> for a living.</div>

  <div class="mt-14 flex items-center justify-between">
    <div class="flex items-center gap-6">
      <div class="avatar">
        <span>BA</span>
        <img src="/photo.jpg" onerror="this.remove()" />
      </div>
      <div>
        <div class="text-2xl font-semibold">Bhavisha Ahuja</div>
        <div class="muted font-mono text-sm mt-1">AI Engineer</div>
      </div>
    </div>
    <div class="intro-qr">
      <img src="/qr-bhavisha-linkedin.png" alt="LinkedIn QR code" />
      <div class="intro-qr-label">Connect on LinkedIn</div>
    </div>
  </div>
</div>

<style>
.intro-qr {
  text-align: center;
}
.intro-qr img {
  width: 130px;
  height: 130px;
  border-radius: 10px;
}
.intro-qr-label {
  margin-top: 0.5rem;
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--muted);
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #1c1d22;
  border: 2px solid var(--accent);
  display: grid;
  place-items: center;
  overflow: hidden;
  font-family: var(--mono);
  color: var(--muted);
}
.avatar img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<!--
Who I am. At work I build the human approval step for AI agents, the moment where the agent stops and a person says yes or no. For fun, I build agents at hackathons.
-->

---

<div class="center-stack">
  <div class="kicker">Show of hands</div>
  <div class="big">Who here has built something<br/>with an <span class="accent">AI agent</span>?</div>
</div>

<!--
Hands up. Now keep your hand up if it takes real actions: running code, sending messages, changing data.
-->

---

<div class="center-stack">
  <div class="kicker">Show of hands</div>
  <div class="big">Would you let it run <span class="accent">all day</span><br/>without checking?</div>
</div>

<!--
Let the hands drop.

"We build these things, but we don't fully trust them yet."
-->

---

<div class="center-stack">
  <div class="text-3xl muted">So what do we add?</div>

  <div v-click class="huge mt-10">Keep a human<br/>in the loop.</div>

  <div v-click class="kicker mt-10" style="margin-bottom:0">The Approval Trap · Bhavisha Ahuja</div>
</div>

<!--
[click] The answer we all reach for.

[click] Title appears.

"Hands up if you've added an approval step for exactly this reason. Me too."
-->

---

<Counter n="50" />

<div class="kicker">Act 2 · The trap</div>

<div class="text-4xl font-bold leading-tight">
  Approval <span class="accent">#1</span>, you read everything.<br/>
  <span v-click>Approval <span class="accent">#50</span>, you recognize a shape.</span>
</div>

<div class="fade-grid mt-10">
  <span
    v-for="i in 50"
    :key="i"
    class="approve-btn"
    :style="{ opacity: Math.max(0.04, 1 - i / 46) }"
  >Approve</span>
</div>

<style>
.fade-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.fade-grid .approve-btn {
  font-size: 0.7rem;
  padding: 0.3rem 0.7rem;
}
</style>

<!--
"You're still in the loop on paper. But what's actually left of the oversight?"
-->

---

<div class="center-stack">
  <div class="kicker">The Approval Trap</div>
  <div class="big">I built a small agent to find out.</div>
  <div v-click class="big accent mt-6">You are the human.</div>
</div>

<!--
It's a simulated agent shortlisting packaging vendors. Every action needs your approval.
If something looks off, shout "REJECT!"
-->

---

<a class="demo-link center-stack items-center text-center" href="https://agentloop-zsq7.onrender.com/">
  <div class="kicker">Approval Loop</div>
  <div class="huge"><span class="live-dot"></span>Live demo</div>
</a>

<style>
.live-dot {
  display: inline-block;
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
  background: var(--danger);
  margin-right: 0.35em;
  vertical-align: middle;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% { opacity: 0.25; }
}
.demo-link,
.demo-link:hover {
  color: inherit;
  border: none;
  text-decoration: none;
  cursor: pointer;
}
</style>

<!--
Click anywhere on the slide to open the app: Approval Loop.
-->

---

<Counter n="400" />

<div class="center-stack">
  <div class="kicker">What just happened</div>
  <div class="big"><span class="accent">15 of 15</span> approved.</div>
  <div v-click class="big mt-6"><span class="danger">1</span> of them sent every vendor contact <span class="danger">to a stranger.</span></div>
</div>

<!--
"You caught it because you were waiting for it. At work, nobody is waiting for it."
-->

---

<div class="kicker">Act 3 · The twist</div>

<div class="text-4xl font-bold leading-tight">
  Don't make humans approve everything.<br/>
  <span class="accent">Make the system earn the human's attention.</span>
</div>

<div class="loops mt-10">
  <div class="loop">
    <div class="loop-name">Approval Loop</div>
    <div class="flow">
      <span class="node">Agent acts</span>
      <span class="arrow">→</span>
      <span class="node human">Human approves <b>every</b> step</span>
      <span class="arrow">→</span>
      <span class="node">Agent acts</span>
      <span class="arrow muted">↺</span>
    </div>
  </div>
  <div v-click class="loop">
    <div class="loop-name accent">Attention Loop</div>
    <div class="flow">
      <span class="node">Agent acts</span>
      <span class="arrow">→</span>
      <span class="node">Routine? <b>continue</b></span>
      <span class="arrow">→</span>
      <span class="node human">Earned it? <b>ask the human</b></span>
      <span class="arrow muted">↺</span>
    </div>
  </div>
</div>

<style>
.loops {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}
.loop {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem 1.4rem;
}
.loop-name {
  font-family: var(--mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.7rem;
  color: var(--muted);
}
.flow {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.node {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background: #1c1d22;
  font-size: 0.95rem;
}
.node.human {
  border: 1px solid var(--accent);
}
.arrow {
  font-size: 1.2rem;
}
</style>

<!--
Two loops. Same agent. The only difference is who has to justify the interruption.
-->

---

<div class="center-stack items-center text-center">
  <div class="kicker">Attention Loop</div>
  <div class="huge"><span class="live-dot"></span>Live demo</div>
</div>

<style>
.live-dot {
  display: inline-block;
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
  background: var(--danger);
  margin-right: 0.35em;
  vertical-align: middle;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% { opacity: 0.25; }
}
</style>

<!--
Same agent, same actions, same human.
Routine actions continue on their own. It only stops for step 13.
-->

---

<div class="kicker">Why we're interrupting you</div>

<div class="reasons">
  <div class="words">
    <div v-click>Novelty</div>
    <div v-click>Consequence</div>
    <div v-click>Scope</div>
    <div v-click>Goal</div>
  </div>
  <div class="score">
    <span class="strike">Anomaly: 87%</span>
  </div>
</div>

<style>
.reasons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 75%;
}
.words {
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.score {
  font-family: var(--mono);
  font-size: 2rem;
  color: var(--muted);
}
.strike {
  text-decoration: line-through;
  text-decoration-color: var(--danger);
  text-decoration-thickness: 4px;
}
</style>

<!--
"Reasons I can argue with, not a score I rubber-stamp."
-->

---

<div class="kicker">Act 4 · What I learned building it</div>

<div class="lessons">
  <div v-click><span class="n">01</span> Presence is not oversight.</div>
  <div v-click><span class="n">02</span> Attention has to be earned.</div>
  <div v-click><span class="n">03</span> Judgment needs practice.</div>
</div>

<style>
.lessons {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.lessons .n {
  font-family: var(--mono);
  font-size: 1rem;
  color: var(--accent);
  vertical-align: middle;
  margin-right: 1rem;
}
</style>

---

<div class="kicker">An old problem in a new system</div>

<div class="timeline">
  <div class="track"></div>
  <div class="point left">
    <div class="year">1983</div>
    <div class="who">Lisanne Bainbridge</div>
    <div class="what">"Ironies of Automation"</div>
    <div class="tag">Research</div>
  </div>
  <div class="point right">
    <div class="year">2026</div>
    <div class="who">Mitchell, Ghosh, Passi</div>
    <div class="what">Approval fatigue</div>
    <div class="tag">Research</div>
  </div>
</div>

<div v-click class="mine">
  <span class="tag mine-tag">My prototype</span>
  The Approval Loop vs. Attention Loop demo you just saw.
</div>

<style>
.timeline {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 2.4rem;
}
.track {
  position: absolute;
  top: 0.6rem;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--muted), var(--accent));
}
.point {
  position: relative;
  max-width: 45%;
}
.point::before {
  content: '';
  position: absolute;
  top: -2.15rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--fg);
}
.point.right {
  text-align: right;
}
.point.right::before {
  right: 0;
  background: var(--accent);
}
.year {
  font-size: 3.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}
.who {
  margin-top: 0.6rem;
  font-size: 1.2rem;
  font-weight: 600;
}
.what {
  color: var(--muted);
}
.tag {
  display: inline-block;
  margin-top: 0.6rem;
  font-family: var(--mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  color: var(--muted);
}
.mine {
  margin-top: 3rem;
  color: var(--muted);
}
.mine-tag {
  margin: 0 0.8rem 0 0;
  border-color: var(--accent);
  color: var(--accent);
}
</style>

<!--
Different decade, different system, same human problem.

Be explicit: the findings are their research. The demo is my prototype.
-->

---

<div class="flex h-full items-center gap-12">
  <div class="flex-1">
    <div class="text-3xl font-bold leading-snug">
      I still click <span class="approve-btn" style="font-size:1.4rem;vertical-align:middle">Approve</span> for a living.<br/>
      <span class="muted">Now I ask: am I still looking?</span>
    </div>
    <div v-click class="big mt-10">Keep the human capable of noticing <span class="accent">when the loop breaks.</span></div>
  </div>
  <div class="qr">
    <img src="/qr-bhavisha-linkedin.png" alt="LinkedIn QR code" />
    <div class="qr-label">Bhavisha Ahuja</div>
  </div>
</div>

<style>
.qr {
  position: relative;
  width: 190px;
  height: 190px;
  flex-shrink: 0;
  border: 1px dashed var(--muted);
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--muted);
  background: #1c1d22;
}
.qr img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}
.qr-label {
  position: absolute;
  bottom: -1.8rem;
  width: 100%;
  text-align: center;
}
</style>

<!--
Callback to slide 1.
-->
