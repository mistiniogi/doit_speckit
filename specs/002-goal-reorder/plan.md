# Implementation Plan: Goal Reordering via Drag-and-Drop

**Branch**: `002-goal-reorder` | **Date**: 2026-02-15 | **Spec**: [specs/002-goal-reorder/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-goal-reorder/spec.md`

**Note**: This plan implements drag-and-drop reordering using Sortable.js for handling interactions and Tailwind CSS for styling. No testing phase (per Constitution). Verification via visual testing on `npm run dev` + code review.

## Summary

Implement drag-and-drop goal reordering functionality within the Goal Tracker Dashboard. Users can reorder goals within active or completed columns independently to customize their prioritization. Reordering uses the Sortable.js library for robust drag-and-drop handling with smooth animations and accessibility support. Goal order persists to localStorage and syncs across browser tabs. Visual feedback includes semi-transparent dragged items, drop indicators, and cursor style changes.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2.3, Next.js 16.1.6 (per Constitution)
**Primary Dependencies**: 
- Next.js 16.1.6 (framework, locked)
- React 19.2.3 (UI library, locked)
- Tailwind CSS v4 (styling, locked)
- **Sortable.js** (drag-and-drop library - NEW, see Complexity Tracking below)

**Storage**: localStorage (client-side only) for persisting goal order; cross-tab sync via storage events
**Verification**: Manual via `npm run dev` visual testing + code review (NO automated testing per Constitution v1.0.0)
**Target Platform**: Web browsers supporting HTML5 drag-and-drop API or Sortable.js polyfills; responsive across mobile/tablet/desktop
**Project Type**: Next.js web application (feature extension)
**Performance Goals**: Drag operations 60fps smooth, drop indicator <200ms latency, persistence immediate
**Constraints**: Must use locked dependency versions; minimal dependencies principle; no unit/integration/e2e tests; within-column reordering only
**Scale/Scope**: Single-user, local storage only; responsive across mobile (375px), tablet (768px), desktop (1024px+)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Applicable Constitution**: DoIt Speckit Constitution v1.0.0

**Compliance Items**:
- ✅ **Clean Code**: Code must follow TypeScript strict mode, consistent naming, modular components
- ✅ **Simple UX**: Feature design must be intuitive and distraction-free
- ✅ **Responsive Design**: All UI must work seamlessly across mobile/tablet/desktop
- ✅ **Minimal Dependencies**: Only use locked stack (Next.js 16.1.6, React 19.2.3, Tailwind CSS v4) - no new dependencies without amendment
- ✅ **NO TESTING**: Absolutely NO unit tests, integration tests, or e2e tests. Verification only via `npm run dev` + code review.

**Violations Found**: None. Drag-and-drop uses Sortable.js (additive dependency) justified below in Complexity Tracking.

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

### New Dependency: Sortable.js

| Decision | Justification | Alternatives Considered |
|----------|---------------|------------------------|
| **Add Sortable.js** | Native HTML5 drag-and-drop API is low-level and verbose; Sortable.js provides: (1) robust cross-browser compatibility, (2) touch device support, (3) built-in animations, (4) keyboard accessibility patterns, (5) well-tested library (40k+ GitHub stars). Significantly reduces custom code complexity and improves UX. | Native HTML5 drag-and-drop API rejected: would require ~500+ lines of custom event handling, browser compatibility polyfills, touch gesture mapping, and accessibility scaffolding—high risk of bugs. Manual React state-based drag UI rejected: poor performance and inability to achieve 60fps smooth interactions. |

### Technology Stack Amendment

The locked dependency list in Constitution v1.0.0 must be amended to include **Sortable.js** (latest stable version, pinned in package.json). This is justified as a necessary library for implementing the drag-and-drop feature with production-quality UX and accessibility.

**Proposed Amendment**:
- Add Sortable.js to locked dependencies with explicit version pinning
- Update Constitution to allowlist Sortable.js as an approved library for drag-and-drop interactions across the project
- Constitution version: v1.0.0 → v1.1.0 (MINOR: new technology addition)
