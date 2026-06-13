# Claude Code Harness

> 🌐 [한국어](README.md) · **English**

A ready-to-use **safety-and-workflow harness for [Claude Code](https://claude.com/claude-code)**.
Drop it into any project and the AI coding agent starts working with guardrails, a clear
step-by-step process, and a paper trail — instead of improvising.

> **In one sentence:** this repository is the *frame* that surrounds the AI — it decides what
> the agent is allowed to do, walks it through a disciplined plan-to-ship process, and keeps a
> record of how each change was checked. There is no app code here yet; you fill that in.

---

## Why would I want this?

Out of the box, an AI coding agent is powerful but unconstrained. It can read any file
(including your passwords), run any command (including destructive ones), declare "done"
without proof, and leave a mess behind. This harness adds the missing structure:

- 🔒 **Safety rails** — it cannot read or commit your secrets (API keys, `.env` files,
  certificates), and dangerous commands (like "delete everything") are blocked automatically.
- 🧭 **A process** — work flows through clear stages: *spec → plan → build → check quality →
  observe → verify → review → ship → clean up.*
- 🧾 **Evidence** — "done" means there is proof (a passing check), not just the AI saying so.
- 🧹 **Tidiness** — the AI is nudged to clean up after itself instead of accumulating clutter.

Think of it like a **harness on a rock climber**: the climber (the AI) still does the
climbing, but the harness catches dangerous falls and keeps everyone following the safe route.

---

## How it works (the four moving parts)

You do not run this harness yourself — **Claude Code reads it automatically** when you open a
project that contains it. Everything lives in plain text files, mostly inside a folder called
`.claude/`. Here are the four pieces and, importantly, *how each one switches on*:

### 1. `CLAUDE.md` — the map (read automatically, always)
A short "table of contents" that Claude Code loads at the start of every session. It tells the
AI where everything is and what the ground rules are. It deliberately stays short and points to
deeper documents in `docs/` rather than containing everything itself.

### 2. `.claude/settings.json` — the permission rules (enforced by Claude Code, always)
A list of what is **denied** (never allowed — e.g. reading a `.env` secrets file) and what
requires **asking first** (e.g. installing a new dependency, or sending anything to the
internet). Claude Code itself enforces this list, on every platform, before any action runs.

### 3. `.claude/hooks/` — the automatic guards (fire on every action)
"Hooks" are small programs that Claude Code runs **automatically at specific moments** — you
never call them. The main one, `block-secrets.js`, runs *before every file read, command, or
search*. If the action would touch a secret or do something destructive, the hook stops it and
explains why. The other two hooks run *after edits* and *when the AI tries to finish*, ready to
plug in quality checks later. (They are written in Node.js so they work identically on Windows,
macOS, and Linux — no extra software to install.)

### 4. `.claude/skills/` and `.claude/agents/` — procedures and specialists (invoked on demand)
- **Skills** are named step-by-step procedures the AI follows for a stage of work. You trigger
  one by typing a slash command, e.g. `/plan` or `/verify`, or the AI picks the right one for
  the task. There are nine, one per stage of the process.
- **Agents** are specialist helpers (a code reviewer, a security auditor, a documentation
  gardener) the AI can hand a focused job to.

> **The short version of "how it activates":** the *map* and *permission rules* load
> automatically; the *hooks* fire automatically around every action; the *skills* and *agents*
> are summoned by name when that stage of work begins. You mostly just talk to Claude Code
> normally — the harness works in the background.

---

## What's inside (the process)

The harness organizes work as a **9-stage loop**, each with a matching skill (numbered from 0
by convention, so stages 0–8 — nine in total):

| Stage | What happens |
|-------|--------------|
| 0 · Spec | Write down what to build and how you'll know it's done |
| 1 · Plan | Turn the spec into a concrete plan |
| 2 · Develop | Build it |
| 3 · Lint | Enforce quality & architecture rules mechanically |
| 4 · Observe | Run it and watch the logs/output |
| 5 · Verify | Reproduce → diagnose → fix → re-check → write a report |
| 6 · Review | A reviewer agent checks the change |
| 7 · Ship | Merge and release through light, fast gates |
| 8 · Clean up | Pay down clutter so the project stays healthy |

Cutting across all stages are concerns like **security, evidence-keeping, verification,
diagnosing-before-fixing, and reproducibility**. The full reasoning lives in `docs/` (start at
[`docs/index.md`](docs/index.md)) and the runtime machinery in `harness/` (start at
[`harness/README.md`](harness/README.md)).

---

## Install & use (simple install)

You need **[Claude Code](https://claude.com/claude-code)** installed. It already includes
**Node.js**, which the safety hooks use — so there is nothing else to install.

1. **Download the files into your project.** Get this repository as a ZIP (the green *Code →
   Download ZIP* button on GitHub) and unzip it into your new project folder. If you prefer the
   command line:
   ```
   git clone https://github.com/QriusQuokka/QQ-Harness.git [project-folder-path]
   cd [project-folder-path]
   ```

2. **Open the project folder with Claude Code.** If you cloned, open the `[project-folder-path]`
   folder; if you used the ZIP, open the unzipped folder.

3. **Let Claude handle the initial setup.** Once Claude Code is open, type:

   > "Set up this project for me"

   Claude will run `node scripts/init-template.mjs`, which cleans out the built-in example,
   starts fresh version control (a first save point), and prints a short to-do list (filling
   your name into `LICENSE`, etc.).
   To run it yourself instead: `node scripts/init-template.mjs`
   *Skip this step if you only want to explore the harness with its example in place.*

4. **Restart Claude Code once.** The safety hooks and permission rules are read when a session
   starts, so a fresh start makes sure they're active.

5. **Start working.** Just talk to Claude Code as usual, or kick off the process with a stage
   command like `/spec` or `/plan`. The guardrails are already on.

> **Starting a brand-new project without forking?** The cleanest paths are the **ZIP download**
> above or GitHub's **“Use this template”** button — both give you a clean copy with no template
> history. A **`git clone`**, by contrast, brings the template's full commit history *and* an
> `origin` remote still pointing at the template repo (an accidental push would go there). If you
> started with a clone, remove or repoint `origin` to make the project yours — step 3's
> `init-template` detects this and reminds you. Prefer to build *on top of* this harness and send
> improvements back? **Fork** it instead.

### Check that the guardrails are live
Ask Claude Code to read a secret file, e.g. *"show me the contents of `.env`"*. It should be
**blocked** with a message pointing to `docs/SECURITY.md`. That confirms the harness is active.

You can also run the security guard's built-in test suite, which checks both that dangerous
actions are blocked and that ordinary commands are *not* over-blocked:
```
node scripts/test-hooks.mjs
```

---

## Starting the conversation — based on how much you have ready

After installation, "now what do I say?" is the natural first question. Bring whatever you
have — the more prepared you are, the faster you reach actual coding; with less, Claude fills
in the gaps alongside you.

**You have just a one-line idea**

> "I want to build a task management app."

Say exactly that. Claude will ask questions — "who is this for?", "what are the must-have
features?" — and work through the requirements with you. By the end of the conversation, what
you're building and how you'll know it's done will be written down.

**You have some features or a general direction in mind**

> "I'd like login, team-based task management, and it should work on mobile too."

Just say it out loud. Claude will sort through the features, ask about priorities and any
missing decisions (tech choices, scope), and build a development plan from there.

**You have a detailed planning document**

> "I'd like to start development based on this spec." (paste or attach the document)

Hand it over and Claude will read it, confirm any missing technical decisions, then move
straight into planning.

---

If you're not sure how to start, just ask **"where do I begin?"** Claude will ask for
whatever it needs.

---

## Commands — triggering a stage directly

You can just talk normally — that works for everything. Commands are slash-prefixed words
(e.g. `/plan`) that tell Claude to start a specific stage explicitly.

**Commands you'll use most**

| Command | What it does | When to use it |
|---------|--------------|----------------|
| `/spec` | Turns an idea or brief into a formal spec | Before development starts, to nail down requirements |
| `/plan` | Turns a spec into a concrete development plan | When you want to see the plan before any code is written |
| `/verify` | Checks that what was built actually works | When you want proof, not just the AI's word for it |
| `/review` | Inspects changes from a reviewer's perspective | Before wrapping up, for a final check |
| `/run` | Runs the app so you can see it | When you want to watch it work in real life |

**The full 9-stage flow**

Every stage has its own command. Use them when you want to walk through the process
step by step explicitly:

```
/spec → /plan → /develop → /lint → /observe → /verify → /review → /ship → /gc
```

> You can also just say "sort out the spec" or "check this works" — Claude will run the right
> stage for you. Commands are the option when you want to be more explicit.

---

## What's protected

- **Secrets are off-limits:** `.env` files (except the safe `.env.example` template), private
  keys, certificates, `secrets/` folders, cloud credentials — cannot be read, edited, copied,
  committed, or searched.
- **Destructive actions are blocked:** recursive force-deletes, force-pushing over history,
  hard resets, disk-formatting commands, and similar.
- **Risky actions ask first:** installing dependencies, and anything that sends data to the
  internet, require your approval.

Full details: [`docs/SECURITY.md`](docs/SECURITY.md) and
[`harness/40_permission-manifest.md`](harness/40_permission-manifest.md).

---

## Requirements

- **Claude Code** (the CLI, desktop, web, or IDE extension).
- **Node.js** — bundled with Claude Code; the hooks and helper scripts use it. No separate
  install needed.
- Works on **Windows, macOS, and Linux**.

---

## Status & license

This is a **frame**, intentionally containing no product code. The quality-enforcement and
finish-line hooks are deliberate no-ops until you wire in a real tech stack (they're marked
clearly inside the files). As real work begins, the harness is meant to be hardened further.

Licensed under the **MIT License** — see [`LICENSE`](LICENSE). Before publishing, replace
`<COPYRIGHT HOLDER>` in that file with your name or organization.
