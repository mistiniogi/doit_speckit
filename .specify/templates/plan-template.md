# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript 5.x] (per Constitution)
**Primary Dependencies**: Next.js 16.1.6, React 19.2.3, Tailwind CSS v4 (locked, per Constitution)
**Storage**: [if applicable, e.g., local state, API backend, database or N/A]
**Verification**: Manual via `npm run dev` + code review (NO automated testing per Constitution v1.0.0)
**Target Platform**: Web (modern browsers, responsive design required)
**Project Type**: Next.js web application
**Performance Goals**: [domain-specific, e.g., <3s initial load, LCP<2.5s or NEEDS CLARIFICATION]
**Constraints**: Must use locked dependency versions; minimal dependencies principle; no unit/integration/e2e tests
**Scale/Scope**: [domain-specific, e.g., 10k users, responsive across mobile/tablet/desktop or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Applicable Constitution**: DoIt Speckit Constitution v1.0.0

**Compliance Items**:
- ✅ **Clean Code**: Code must follow TypeScript strict mode, consistent naming, modular components
- ✅ **Simple UX**: Feature design must be intuitive and distraction-free
- ✅ **Responsive Design**: All UI must work seamlessly across mobile/tablet/desktop
- ✅ **Minimal Dependencies**: Only use locked stack (Next.js 16.1.6, React 19.2.3, Tailwind CSS v4) - no new dependencies without amendment
- ✅ **NO TESTING**: Absolutely NO unit tests, integration tests, or e2e tests. Verification only via `npm run dev` + code review.

**Violations Found**: [List any conflicts with constitution - if none, state "None"]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths. The delivered plan must not include Option labels.
-->

```text
# Next.js Web Application Structure (DEFAULT for this project)
app/
├── components/        # React components (UI)
├── lib/
│   ├── models/        # Data models/types
│   └── services/      # Business logic
├── page.tsx          # Main page
├── layout.tsx        # Layout wrapper
└── globals.css       # Global styles

public/               # Static assets

package.json          # Dependencies (locked versions)
tsconfig.json         # TypeScript config
tailwind.config.ts    # Tailwind CSS config
```

Note: Do NOT add `/tests/` or test-related directories (NO TESTING per Constitution)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Compliance gap (if any):

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
