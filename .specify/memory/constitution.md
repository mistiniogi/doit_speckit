<!-- SYNC IMPACT REPORT
Version: 1.0.0 (NEW - initial constitution)
Modified Principles: N/A (Initial creation)
Added Sections:
  - I. Clean Code
  - II. Simple UX
  - III. Responsive Design
  - IV. Minimal Dependencies
  - Testing Philosophy (NON-NEGOTIABLE)
  - Technology Stack
Removed Sections: N/A
Templates Requiring Updates:
  - ✅ spec-template.md (align with no-testing constraint)
  - ✅ tasks-template.md (remove test-related task categories)
  - ✅ plan-template.md (align with no-testing constraint)
Follow-up TODOs: None
-->

# DoIt Speckit Constitution

## Core Principles

### I. Clean Code

Code MUST be readable, maintainable, and well-structured. TypeScript strict mode enforced; naming conventions clear and consistent; components modular and single-purpose; comments explain "why" not "what"; dead code is immediately removed; no technical debt accumulation permitted.

**Rationale**: Clean code reduces bugs, accelerates onboarding, and enables confident refactoring. Maintainability is non-negotiable for long-term project health.

### II. Simple UX

User interface MUST be intuitive and distraction-free. No unnecessary features; clear navigation paths; minimize user cognitive load; prioritize clarity over feature completeness; accessibility first (WCAG standards); user testing drives decisions.

**Rationale**: Simple UX drives adoption and reduces support burden. Complexity is introduced only when justified by measurable user benefit.

### III. Responsive Design

All interfaces MUST work seamlessly across devices (mobile, tablet, desktop). Mobile-first approach required; flexible layouts using Tailwind CSS utilities; test across viewport sizes; no layout breakage at any screen width.

**Rationale**: Responsive design ensures consistent user experience regardless of device, meeting modern web standards and user expectations.

### IV. Minimal Dependencies

External dependencies MUST be kept to an absolute minimum. Every new dependency requires explicit justification; prefer built-in framework features; consolidate where possible; security and maintenance reviewed for all additions; lock versions explicitly in package.json.

**Rationale**: Fewer dependencies = smaller bundle, faster builds, less maintenance burden, and reduced attack surface. Locked to: Next.js 16.1.6, React 19.2.3, React-DOM 19.2.3, Tailwind CSS v4.

## Testing Philosophy (NON-NEGOTIABLE)

**NO testing of any kind is permitted**: No unit tests, no integration tests, no end-to-end tests, no manual QA scripts. This constraint supersedes all other guidance and best practices. Development relies on:
- Direct visual verification during `npm run dev`
- Code review for logic validation
- TypeScript type safety for error prevention
- Browser DevTools for debugging

## Technology Stack

Locked versions from package.json:
- **Next.js**: 16.1.6 (main framework)
- **React**: 19.2.3 (UI library)
- **React-DOM**: 19.2.3 (DOM rendering)
- **Tailwind CSS**: v4 (styling engine)
- **TypeScript**: ^5 (type safety)
- **ESLint**: ^9 (linting)

All dependencies beyond these core libraries require constitution amendment to add.

## Governance

**Constitution Supremacy**: This constitution supersedes all other project guidance, practices, and standards. If any document conflicts with these principles, this constitution wins.

**Amendment Process**: Changes to core principles, adding/removing principles, or technology stack modifications require explicit documentation. Version bumping rules:
- MAJOR: Principle removals or fundamental redefinitions
- MINOR: New principles or expansion of guidance
- PATCH: Clarifications, wording refinements, typo fixes

**Compliance Verification**: All code changes must be reviewed against these four principles and the no-testing constraint.

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
