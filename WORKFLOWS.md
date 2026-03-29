# WORKFLOWS.md — Working Agreements

**This file documents how we work. Read it. Follow it. Update it when agreements change.**

---

## 1. Branch & Deploy Strategy

```
feature branch (claude/*)  →  main  →  Netlify (auto-deploy)
```

- **`main`** is the production branch. Every push deploys to Netlify.
- **Feature branches** use the pattern `claude/<description>`. Develop here, merge to `main` when ready.
- **Always run `npm run build` before merging to `main`.** If it doesn't build, it doesn't ship.
- **Deploy commits** are prefixed with `[deploy]` in the commit message so we can trace what went live and when.

---

## 2. Version Tracking — The Three Files

We maintain three files that together provide full traceability. If you make a change and don't update these, the next person (human or AI) will lose track.

### `version.json` — Where Are We?

Machine-readable state. Answers: what version is the spec? What version is the site? Are they in sync? What's the status of each module, each primitive, each gap?

**Update when:** a gap closes, a module changes status, a version ships, or the spec/site sync status changes.

### `decisions.jsonl` — Why Is It This Way?

Append-only decision log. One JSON object per line. Answers: what was decided, when, why, by whom, and what it affects.

**Rules:**
- **NEVER edit existing lines.** The log is append-only. This is non-negotiable.
- If a decision is reversed or modified, add a NEW entry with `"supersedes": "DEC-NNN"`.
- This creates a traceable chain: if something breaks, you can walk backward from the current decision through every change that led to it.
- Next ID: look at the last line of the file and increment.

**Update when:** any design decision is made, any open gap is resolved, any architectural choice changes.

### `CHANGELOG.md` — What Happened When?

Human-readable narrative. Answers: what changed, in which layer (spec vs site), and whether they're in sync.

**Update when:** every meaningful change to either the spec or the site.

---

## 3. Commit Message Conventions

```
[deploy] Update waterfall section with SAFF loan priority    ← deploys to production
Add trust score decay calculation to spec                     ← feature branch work
Fix mobile nav overflow on 7-item layout                      ← bug fix
```

- Present-tense, descriptive
- `[deploy]` prefix for commits that go to `main` and trigger a Netlify deploy
- Reference decision IDs when relevant (e.g., "per DEC-008")

---

## 4. What Gets Recorded

| Event | Where It Goes |
|---|---|
| New design decision | `decisions.jsonl` (new line) |
| Changed design decision | `decisions.jsonl` (new line with `supersedes`) |
| Gap resolved | `version.json` (update gap status) + `decisions.jsonl` (new decision) + `CHANGELOG.md` |
| New module added | `version.json` (add module) + `CHANGELOG.md` |
| Site page added/changed | `CHANGELOG.md` + `version.json` (update site version if significant) |
| Spec version bump | `version.json` (spec version) + `CHANGELOG.md` |
| Site version bump | `version.json` (site version) + `CHANGELOG.md` |
| Deploy to production | Commit with `[deploy]` prefix |

---

## 5. Content Voice

The site explains complex systems through accessible language and metaphors:
- "Trust breaks before the grain does" — not "systemic trust deficit in agricultural value chains"
- "A digital wax seal" — not "SHA-256 hash-based integrity verification"
- "Like water flowing downhill" — not "deterministic rule-based settlement cascading"

When adding content, maintain this voice. Technical accuracy underneath, accessible language on top.

---

## 6. What NOT to Do

- **Don't expose NDA content** to external services, public APIs, or AI training
- **Don't push to `main` without building first** — broken deploys waste everyone's time
- **Don't edit `decisions.jsonl` lines** — append only, always
- **Don't add Tailwind, TypeScript, or component libraries** — the stack is intentionally minimal
- **Don't simplify domain terminology** — use exact CATSP terms (ZATTF, not "trust fund"; 3A cluster, not "cooperative")
- **Don't modify `trust-infrastructure-v01.html`** — it's the archived v0.1 reference
- **Don't add light mode** — dark theme only

---

## 7. If Something Goes Wrong

1. Check `decisions.jsonl` — walk backward through the decision chain to find what changed
2. Check `CHANGELOG.md` — find when the change happened
3. Check `version.json` — see if spec and site are out of sync
4. Check git log — find the specific commit with `git log --oneline`
5. If a deploy broke production, revert the commit on `main` and push

---

*Last updated: 2026-03-29 — v0.5 site rebuild*
*Update this file when working agreements change.*
