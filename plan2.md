# Qoder Test Prompt Pack — Fast, Safe 2.5-Hour Workflow

Use **one Qoder session for the whole test** so it keeps the brief, architecture, and prior decisions in context.

The strategy is:

> **Plan once → build the base → test it → commit → implement optional features in smart batches → quick smoke test → commit → final audit → fresh clone → final push.**

The aim is to maximise marks **without wasting time on repeated server restarts or long terminal waits**.

---

# Recommended Terminal Setup

Use separate terminals so Qoder does not waste time managing long-running app processes.

```text
Terminal 1 — Qoder
qoder

Terminal 2 — Backend dev server
npm run dev

Terminal 3 — Frontend dev server (if separate)
npm run dev
```

Prefer dev/watch mode where possible:

```text
Frontend → Vite / hot reload
Backend  → nodemon / node --watch / tsx --watch
```

The app servers should stay running while Qoder edits code.

Qoder should verify against those running servers instead of repeatedly doing:

```text
kill → sleep → start → sleep → test
```

---

# 1. Plan the Entire Test First

```text
We are completing a Software Design Project test with a strict 2.5-hour time limit.

This repository starts empty.

Read the ENTIRE test specification before modifying any files.

Your objective is to maximise marks while producing a simple, reliable application that can be cloned and run on another machine.

Before writing code, analyse the brief and give me:

## Mandatory/base requirements
- Every requirement needed for the base submission.
- Anything that appears likely to be checked automatically.
- Required technologies, filenames, ports, scripts, database setup, Docker requirements, repository structure, or submission rules.

## Optional features
For every optional feature identify:
- marks available
- implementation effort: LOW / MEDIUM / HIGH
- implementation risk: LOW / MEDIUM / HIGH
- estimated standalone effort
- estimated incremental effort if related prerequisite/shared features are already implemented
- which parts of the system it affects
- frontend impact
- backend impact
- database/schema impact
- configuration/infrastructure impact
- dependencies
- whether implementing it makes another feature substantially easier
- what shared infrastructure/code it unlocks for later features

## Feature batching
Group optional features into sensible implementation batches where features:
- touch the same parts of the codebase
- share implementation work
- are individually low/medium risk
- can be tested together efficiently

For every proposed batch tell me:
- features included
- total marks
- effort
- risk
- shared work
- likely regression impact

Do NOT group unrelated high-risk features together just to increase total marks.

## Architecture
Recommend the simplest architecture that satisfies the brief.

Prefer:
- simple conventional technologies
- few dependencies
- minimal configuration
- easy debugging
- easy fresh-clone setup
- watch/hot-reload development commands where appropriate

Avoid:
- unnecessary frameworks
- unnecessary services
- overengineering
- premature abstractions
- anything that adds complexity without earning marks

## Implementation strategy
Create an implementation order that:
1. gets the mandatory/base application working end-to-end as early as possible
2. protects a working submission before optional features
3. then adds optional marks in efficient feature batches
4. leaves enough time for final verification, a fresh-clone test, and final Git push

## Time-efficient verification rules
We are under a strict time limit.

During implementation:
- do not sacrifice verification
- minimise unnecessary terminal waiting
- reuse already-running development servers whenever possible
- prefer watch/hot-reload modes
- do not repeatedly kill/restart services after every small change
- only restart a service when genuinely required
- prefer quick readiness checks such as curl/health endpoints instead of fixed sleep delays
- avoid commands that block indefinitely
- if a command appears stuck or unusually slow, diagnose rather than waiting indefinitely
- use quick targeted checks while coding
- reserve full regression testing for the end of a feature batch and the final audit

If any requirement is ambiguous or risky, point it out.

Do NOT modify files yet.

Stop after the plan so I can review it.
```

---

# 2. Build the Working Base

```text
Implement ONLY the mandatory/base requirements from the specification.

Do not implement optional features yet.

The goal of this stage is to create a complete, working end-to-end baseline as quickly and safely as possible.

While implementing:

- follow the agreed simple architecture
- avoid unnecessary dependencies
- avoid unrelated refactoring
- do not add features that are not required
- use proper configuration instead of machine-specific paths
- keep fresh-clone reproducibility in mind
- run relevant build/test/type-check commands as you work
- actually verify the application where possible
- fix real build/runtime errors rather than assuming the code works

## Important server/terminal rule
Assume I may keep long-running frontend/backend development servers running in separate terminals.

Therefore:
- reuse already-running development servers whenever possible
- rely on hot reload/watch mode where available
- do not repeatedly kill/restart servers after small changes
- only restart when a configuration, dependency, environment, database, or non-watched server change genuinely requires it
- prefer quick readiness checks instead of fixed sleep delays
- do not launch duplicate dev servers unnecessarily
- avoid blocking terminal commands that wait forever

If the system has multiple parts, verify their communication where applicable:

frontend → backend
backend → database

Do not consider this stage complete simply because the files exist.

Completion means:
- dependencies install successfully
- application builds successfully where applicable
- application starts successfully
- mandatory functionality works end-to-end
- there are no obvious runtime errors
- required data persists correctly if persistence is required

Before handing the project back to me, perform as much verification as possible automatically using FAST checks:
- build
- tests
- type checking
- API requests
- database checks
- linting if relevant
- any provided validation or automarker checks

Do not perform unnecessary full restarts between minor changes.

When the mandatory/base application is working, STOP.

Do not begin optional features.

Tell me:

1. the exact commands to start the application
2. the URL(s) I should open
3. the shortest manual test I can perform to prove the mandatory/base functionality works
4. what I should expect to happen
5. anything that remains unverified

I will manually test the application before we continue.
```

After this stage, if it works:

```bash
git add .
git commit -m "Working base implementation"
git push
```

---

# 3. Choose the Best Feature Batch

```text
The current base application is working.

Do NOT modify any files yet.

Review all remaining optional features against the CURRENT implementation.

Group them into sensible implementation batches.

A good batch should:
- contain related features
- share implementation work
- touch similar parts of the codebase
- be testable together
- have acceptable regression risk

For every possible batch tell me:

- features included
- total marks
- implementation effort
- implementation risk
- standalone effort of the features if done separately
- estimated combined/incremental effort if done as this batch
- where time is saved through shared implementation
- files/components likely to change
- database/schema impact
- dependencies
- shared work
- risk of breaking the current working app
- whether this batch makes another later batch easier
- approximate marks-per-effort value compared with the other batches

Then recommend the best next batch using this priority:

HIGH MARKS
LOW/MEDIUM EFFORT
LOW/MEDIUM RISK

Do not recommend based only on highest mark value.

Prefer several cheap related marks over one risky feature if that gives a better return.

Also tell me which remaining features or batches are probably NOT worth attempting under the time limit.

Do NOT implement anything yet.

Stop after the comparison so I can choose.
```

---

# 4. Implement One Selected Feature Batch

```text
Implement ONLY this selected feature batch:

[PASTE THE EXACT FEATURE REQUIREMENTS HERE]

The current application is already working, so preserving that working state is more important than architectural improvements.

These features are being implemented together because they share implementation work.

Before changing anything, briefly identify:
- which existing parts of the application this batch will touch
- any shared implementation between the features
- any obvious regression risk

Then implement the batch using the smallest reasonable changes.

Rules:

- preserve all previously working functionality
- follow the existing architecture
- do not perform unrelated refactoring
- do not redesign working components
- do not replace frameworks or libraries unnecessarily
- do not implement features outside this batch
- avoid adding dependencies unless genuinely required
- do not change unrelated code just to make it cleaner

## Time-efficient verification rules
Assume long-running dev servers may already be running in separate terminals.

During this batch:
- reuse existing running servers where possible
- rely on hot reload/watch mode where available
- do not repeatedly kill and restart services after each small change
- only restart when genuinely necessary
- avoid fixed sleep delays where a readiness/health check can confirm the server is ready
- avoid blocking commands that wait indefinitely
- use quick targeted checks during implementation
- save full regression testing for the end of this batch

After implementation:

1. run relevant build/test/type-check commands
2. verify each feature in the batch
3. check for regressions in important existing functionality
4. fix any regression caused by this batch

Before handing it back to me, perform as much automated verification as possible:
- build
- tests
- API requests
- database checks
- type checking
- relevant automated checks

When the batch is working, STOP.

Give me a SHORT manual smoke-test checklist that covers:

- each new feature in this batch
- one or two critical existing behaviours to make sure the base still works

Tell me:
- what to click/do
- what result I should expect
- anything that remains unverified

Do not begin another feature batch automatically.
```

After the batch passes your smoke test:

```bash
git add .
git commit -m "Add <feature batch>"
git push
```

Then repeat Prompt 3 and Prompt 4 only while the next batch is still worth the time/risk.

---

# 5. Final Audit and Submission Check

```text
Stop implementing new features.

Re-read the ORIGINAL test specification from beginning to end.

Audit the CURRENT repository against every requirement.

For each requirement report one of:

PASS — implemented and verified
FAIL — implemented but currently incorrect
MISSING — not implemented
NOT VERIFIED — appears implemented but has not actually been tested

Pay special attention to anything likely to be automatically marked.

Then perform a submission/reproducibility audit.

Assume the marker will:

1. clone the repository onto another machine
2. follow the README
3. run the documented commands
4. test the application

Check for:

- build failures
- startup failures
- missing dependencies
- dependencies only installed globally
- missing package lock files
- incorrect ports
- frontend/backend connectivity
- database connectivity
- missing database setup/migrations
- required environment variables
- missing .env.example where appropriate
- hardcoded machine-specific paths
- incorrect localhost usage
- untracked required files
- required files accidentally ignored
- secrets committed to Git
- incorrect README instructions
- missing start commands
- broken tests or automarker checks
- Docker networking/build issues if Docker is used

Run any relevant:
- tests
- builds
- type checks
- provided automarker scripts
- validation scripts

At this stage, full verification is appropriate.

Fix ONLY issues that affect:
- mandatory marks
- already-implemented features
- application startup
- tests/automarker
- fresh-clone reproducibility
- submission correctness

Do NOT:
- add new optional features
- perform cosmetic refactoring
- redesign the architecture
- upgrade dependencies unnecessarily

Finally give me:

1. a final PASS / FAIL summary
2. the exact commands I should run for a fresh-clone test
3. the exact commands needed for the final Git commit/push if required

After this point, treat the codebase as frozen except for critical submission fixes.
```

---

# Tiny Emergency Prompts

## If Qoder is going in circles

```text
Stop changing things. Tell me what definitely works, what definitely fails, and the smallest path back to a stable working submission.
```

## If there is an error

```text
Use the actual error output. Diagnose the root cause first, then make the smallest possible fix. Do not refactor unrelated code.
```

## If a batch broke something

```text
This worked before the last batch. Find the regression and restore the previous working behaviour without redesigning the app.
```

## If a feature/batch is taking too long

```text
We are under time pressure. Re-read the exact requirements and find the simplest valid implementation. If this batch is no longer worth the marks versus risk, tell me to abandon it.
```

## If you are nearly out of time

```text
We are nearly out of time. Protect already-secured marks. Recommend whether to fix the current issue, abandon it, or move immediately to final submission checks.
```

## If Qoder starts overengineering

```text
Do not redesign or refactor. Keep the current architecture and make only the minimum changes needed to satisfy the requirements.
```

## If Qoder keeps restarting servers

```text
Minimise server restart overhead. Reuse the already-running development server when possible and rely on hot reload/watch mode. Only restart a service when genuinely required. Avoid repeated kill/sleep/start cycles.
```

## If Qoder uses long fixed sleeps

```text
Avoid unnecessary fixed sleep delays. Prefer a short readiness or health check and continue as soon as the service is actually ready.
```

## If a terminal command looks stuck

```text
This command appears to be taking too long. Do not wait indefinitely. Determine whether it is a long-running process, blocked command, or genuine build/test task, then use the fastest safe alternative.
```

## If you want a quick manual test

```text
Give me the shortest possible smoke test: what command to run, what URL to open, what to click/do, and what result proves this batch works.
```

## If you want to verify before continuing

```text
Stop adding features. Use quick automated checks against the current running application and tell me what definitely works before we continue.
```

## If you want the next best batch fast

```text
Which remaining batch gives the best total marks for the least time and regression risk based on the CURRENT codebase?
```

## If a risky feature is tempting

```text
Compare this feature against the remaining low-risk features by marks, effort, dependencies, and regression risk. Tell me whether it is actually worth attempting now.
```

## If you are about to submit

```text
Freeze functionality. No new features or refactoring. Only fix issues that could lose marks or cause the project to fail after a fresh clone.
```

---

# Recommended Test Flow

```text
READ BRIEF
 ↓
PLAN EVERYTHING
 ↓
BUILD BASE
 ↓
YOU MANUALLY TEST BASE
 ↓
COMMIT + PUSH
 ↓
KEEP DEV SERVERS RUNNING
 ↓
ANALYSE OPTIONAL FEATURE BATCHES
 ↓
CHOOSE BEST BATCH
 ↓
IMPLEMENT BATCH
 ↓
FAST AUTOMATED CHECKS
 ↓
YOU DO QUICK SMOKE TEST
 ↓
COMMIT + PUSH
 ↓
REPEAT ONLY WHILE THE MARKS ARE WORTH THE RISK
 ↓
FINAL AUDIT
 ↓
FULL CHECKS / AUTOMARKER
 ↓
FRESH CLONE TEST
 ↓
FINAL PUSH
```

---

# Verification Strategy

Use three levels of verification.

## During active coding

Keep checks cheap and fast:

```text
build/type-check
API curl
quick DB check
targeted test
```

Avoid unnecessary full restarts.

## After each feature batch

Do a short manual smoke test:

```text
app still loads
new features work
one or two critical old flows still work
```

## Near submission

Do the full checks:

```text
all requirements
tests/automarker
README
fresh clone
final Git push
```

---

# Why Feature Batching Saves Time

Batching does **not** magically make unrelated features faster.

It helps when several features share context, code, setup, testing, or infrastructure.

If four 5-mark features each take around 15 minutes individually, part of that time may be repeated overhead:

```text
Feature A   implementation + re-reading + restart/test + manual check + commit
Feature B   implementation + re-reading + restart/test + manual check + commit
Feature C   implementation + re-reading + restart/test + manual check + commit
Feature D   implementation + re-reading + restart/test + manual check + commit
```

A good batch reduces that repeated overhead:

```text
Understand shared area once
 ↓
Implement related Feature A
 ↓
Implement related Feature B
 ↓
Implement related Feature C
 ↓
Implement related Feature D
 ↓
Run automated checks once
 ↓
Do one combined smoke test
 ↓
Commit once
```

The biggest gain comes from **shared implementation**.

Example:

```text
Categories              5 marks
Filter by category      5 marks
Sort by category        3 marks
Category counts         3 marks
```

If `Categories` requires the database field/table, API changes, and frontend controls, the later category features may become very cheap because that infrastructure already exists.

So Qoder should estimate both:

```text
Standalone effort
vs
Incremental effort after related features already exist
```

A useful feature cluster looks like:

```text
search + filtering + sorting + pagination
```

because these may share the same list page, API endpoint, query parameters, and test flow.

A poor batch looks like:

```text
authentication + file uploads + Docker + WebSockets
```

because the implementation barely overlaps and failures become harder to isolate.

## Marks Strategy

If the target is roughly 50 marks, think in clusters rather than individual 3–7 mark features.

For example:

```text
Base                  20
Cheap Batch A         12
Cheap Batch B         10
Medium Batch C         8
-------------------------
Total                  50
```

This may be much more achievable than treating the task as ten separate 5-mark feature cycles.

When choosing optional work, the key question is:

> **Which group of related features gives the most marks from the least unique work?**

Prefer:

```text
CHEAP CLUSTERS
Several related small features with shared code/setup.

MEDIUM CLUSTERS
Useful if time remains and regression risk is acceptable.

EXPENSIVE STANDALONE FEATURES
Attempt only if their marks justify the remaining time and risk.
```

Do not batch unrelated features purely because they are individually small.

---

# Practical Batch Size Guide

Use this as a rough guide:

```text
Tiny UI/basic features       → 3–5 in one batch
Related CRUD features        → 2–4 in one batch
Medium features              → 2–3 in one batch
Database/schema-heavy        → 1–2 in one batch
Authentication/uploads/etc.  → usually 1 feature at a time
```

Good batch example:

```text
search + filtering + sorting + pagination
```

Bad batch example:

```text
authentication + file uploads + Docker + realtime WebSockets
```

---

# Core Principle

The goal is not to make Qoder test everything after every tiny change.

The goal is to:

- secure a working base early
- keep dev servers alive in separate terminals
- minimise repeated process restarts
- use quick checks while coding
- accumulate optional marks in sensible batches
- manually smoke-test each batch
- keep Git checkpoints
- do exhaustive verification only when it matters
- always preserve a recent working, gradable submission
