# AI Workflow

This repository uses AI as a planning and implementation accelerator, not as a blind code generator.

## Principles

- Read the challenge scope first
- Read the project README and app-level READMEs before planning
- Follow `.cursor/rules/` as the source of truth for project behavior
- Prefer review-first and plan-first workflows
- Prefer minimal and reversible changes
- Keep challenge requirements above personal stack preferences
- Do not introduce abstractions before the second real use case
- Keep frontend and backend boundaries explicit
- Prefer the simplest maintainable solution that satisfies the scope

## Expected AI workflow

1. Inspect the repository
2. Read `docs/teddy-challenge-scope.md`
3. Read `README.md` and app-level `README.md` files
4. Create a short diagnosis
5. Propose a minimal implementation plan
6. List files to create or change
7. Wait for review before coding
8. Implement only the approved scope
9. Run a scope and rules compliance review before closing the phase

## Agents and subagents

The AI-assisted development was organized through specialized agents, each with a clear responsibility boundary. The full agent definitions — including their instructions, when to use each one, and the recommended orchestration flow — are documented in [`docs/teddy-challenge-agents-setup.md`](./teddy-challenge-agents-setup.md).

In summary:

| Agent | Role |
|---|---|
| `challenge-orchestrator` | Plans each phase, reviews scope, delegates to the correct subagent |
| `frontend-implementer` | Implements React features following the approved plan |
| `backend-implementer` | Implements NestJS modules following the approved plan |
| `workspace-devops` | Handles Nx, Docker, operational setup, and README accuracy |
| `scope-reviewer` | Reviews implementation against scope, rules, and repo state |

This structure ensures that AI acts as a disciplined collaborator — planning before coding, respecting project rules, and validating against the challenge scope at each phase boundary.

## Phase-based execution

Work is intentionally split into small phases, such as:

- backend auth
- frontend login
- clients CRUD backend
- clients CRUD frontend
- dashboard
- workspace and Docker improvements
- final scope review

## Optional libraries

Some libraries may be used when justified by simplicity and maintainability, but they are not treated as mandatory unless explicitly required by the challenge scope.

Examples:
- TanStack Query
- Zustand
- shadcn/ui
- React Hook Form

## Review expectations

Before considering a phase complete, verify:

- challenge scope compliance
- rule compliance
- no unnecessary abstractions
- accurate README instructions
- correct operational endpoints and documentation when applicable