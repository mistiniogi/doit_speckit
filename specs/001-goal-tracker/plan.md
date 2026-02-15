# Implementation Plan: Goal Tracker Dashboard

**Branch**: `001-goal-tracker` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)

## Summary

Build a goal tracking web application called "doit" with a two-column dashboard displaying active and completed goals. Users can add new goals via modal form, mark goals complete with a checkbox, and delete goals with confirmation. The interface uses a modern light pastel theme (Light Pastels palette defined in spec), is fully responsive across mobile/tablet/desktop, and persists all data in browser localStorage. Technical approach prioritizes clean, simple code using shadcn UI components, Tailwind CSS with @theme for styling, date-fns for date calculations, and React state management.

## Technical Context

**Language/Version**: TypeScript 5.x (per Constitution)
**Primary Dependencies**: 
- Next.js 16.1.6 (framework)
- React 19.2.3 (UI library)
- Tailwind CSS v4 with @theme customization (styling)
- shadcn/ui (component library for modals, forms, buttons)
- date-fns (date formatting and calculations)
- uuid (goal ID generation)

**Storage**: Browser localStorage for goal persistence (client-side only, no backend)
**Verification**: Manual via `npm run dev` + code review (NO automated testing per Constitution v1.0.0)
**Target Platform**: Web (modern browsers, responsive across mobile/tablet/desktop)
**Project Type**: Next.js web application (single-page with client-side state)
**Performance Goals**: Dashboard renders fully within 2 seconds (SC-001); new goals added/displayed instantly; smooth animations
**Constraints**: 
- Locked to Constitution dependency versions (Next.js 16.1.6, React 19.2.3, Tailwind CSS v4)
- Minimal dependencies principle - only add what's necessary
- No unit/integration/e2e tests
- WCAG 2.1 Level A accessibility required
**Scale/Scope**: Single-user, client-side only; responsive across mobile (375px), tablet (768px), desktop (1024px+); supports 50+ goals per user with scrollable columns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Applicable Constitution**: DoIt Speckit Constitution v1.0.0

**Compliance Items**:
- ✅ **Clean Code**: TypeScript strict mode, meaningful component names (GoalCard, GoalForm, GoalList), single-responsibility components, proper typing
- ✅ **Simple UX**: Two-column layout, single action per interaction, empty states guide users, modal for add form (not inline)
- ✅ **Responsive Design**: Tailwind responsive utilities (sm:, md:, lg:) for mobile/tablet/desktop; no custom media queries
- ✅ **Minimal Dependencies**: Using only locked stack + shadcn (UI components), date-fns (date math), uuid (IDs). No unnecessary packages.
- ✅ **NO TESTING**: Zero test files, zero test scenarios. Verification via `npm run dev` visual inspection + code review only.

**Violations Found**: None. Plan fully complies with Constitution v1.0.0.

## Project Structure

### Documentation (this feature)

```text
specs/001-goal-tracker/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (Implementation plan)
├── research.md          # Phase 0 (design research, color system)
├── data-model.md        # Phase 1 (detailed entities, types)
├── quickstart.md        # Phase 1 (MVP walkthrough)
├── contracts/           # Phase 1 (if needed - currently not applicable for client-side)
├── CLARIFICATION_REPORT.md  # Clarification session results
└── checklists/
    └── requirements.md   # Specification quality checklist
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── goal-dashboard.tsx       # Main dashboard component
│   ├── goal-column.tsx          # Reusable column with goal list
│   ├── goal-card.tsx            # Individual goal display
│   ├── goal-form-modal.tsx       # Add goal modal form
│   ├── delete-confirmation-modal.tsx  # Delete confirmation dialog
│   └── goal-form.tsx            # Form logic (title, date picker)
├── lib/
│   ├── models/
│   │   └── goal.ts              # Goal interface/types
│   ├── services/
│   │   ├── goal-service.ts       # Goal CRUD operations
│   │   ├── storage-service.ts    # localStorage persistence
│   │   └── date-service.ts       # date-fns wrapper for calculations
│   └── utils/
│       └── color-theme.ts        # Tailwind @theme color constants
├── hooks/
│   └── use-goals.ts             # Custom hook for goal state management
├── page.tsx                     # Home page (renders GoalDashboard)
├── layout.tsx                   # Root layout
├── globals.css                  # Global styles + Tailwind directives
└── theme-config.ts              # Tailwind config with Light Pastels palette

public/                           # Static assets

package.json                      # Dependencies (locked versions)
tsconfig.json                     # TypeScript strict mode config
tailwind.config.ts                # Tailwind @theme configuration
next.config.ts                    # Next.js config

**NOTE**: No /tests/ directory (NO TESTING per Constitution)
```

### Key Technical Decisions

**Color System**: Tailwind @theme with Light Pastels palette
```tailwind
@theme {
  colors: {
    'pastel-pink': '#FFE0EC',
    'pastel-blue': '#E0F4FF',
    'pastel-green': '#E0FFE0',
    'pastel-purple': '#F0E0FF'
  }
}
```

**State Management**: React hooks (useState, useEffect) + localStorage
- No Redux or complex state library needed for single-page MVP
- localStorage synced via custom hook (useGoals)

**Date Handling**: date-fns library
- `differenceInDays()` for remaining days calculation
- `format()` for display formatting (e.g., "Feb 15, 2026")
- `isWithinInterval()` for 3-day urgency check

**UI Components**: shadcn/ui
- Button, Input, Modal/Dialog, Form, Card components
- Pre-built, accessible components following composition pattern
- Theming via Tailwind CSS

**Data Persistence**: localStorage
- Goals stored as JSON array under key 'doit-goals'
- Auto-synced on every state change
- No backend/API calls

## Complexity Tracking

**No Constitution violations detected**. Plan fully aligns with DoIt Speckit Constitution v1.0.0.

---

## Phase Implementation Workflow

### Phase 0: Research & Design (THIS DOCUMENT)
Generate research.md with:
- Color system research (Tailwind @theme implementation)
- shadcn/ui component selection and integration
- date-fns usage patterns for date calculations
- localStorage persistence strategy
- Responsive breakpoint strategy

### ✅ Phase 0: Research (Complete)
**Deliverable**: [research.md](./research.md)
- Color system research (Tailwind @theme Light Pastels palette with hex values)
- shadcn/ui component selection (Button, Dialog, Input, Checkbox, Card, Form, Alert)
- date-fns usage patterns (getDaysRemaining, isUrgent, formatDate, formatDaysRemaining)
- localStorage persistence strategy with storage-service implementation
- Responsive design breakpoints and mobile-first approach
- WCAG 2.1 Level A accessibility compliance path

### ✅ Phase 1: Design & Architecture (Complete)
**Deliverables**: 
- **[data-model.md](./data-model.md)**: Goal interface with 6 required fields, computed properties, form validation rules, state transitions, deserialization logic
- **[quickstart.md](./quickstart.md)**: MVP walkthrough showing full user journey (empty state → add goal → goal appears → mark complete → delete)

### ⏳ Phase 2: Implementation Tasks (Pending)
Generate tasks.md via `/speckit.tasks` with:
- User Story 1 tasks: Dashboard, columns, empty states, responsive layout
- User Story 2 tasks: Modal form, validation, goal creation
- User Story 3 tasks: Checkbox state change, delete modal, confirmation
- Polish tasks: Color theme, accessibility, localStorage edge cases

### ⏳ Agent Context Update (Pending)
Run: `.specify/scripts/bash/update-agent-context.sh copilot`
- Adds Goal Tracker technical decisions to agent knowledge
- Registers shadcn/ui, date-fns, localStorage patterns
- Documents Tailwind @theme approach

---

## Version & Status

**Plan Version**: 1.0.0  
**Status**: PHASE 1 COMPLETE (ready for Phase 2 task generation)  
**Generated Artifacts**: research.md, data-model.md, quickstart.md  
**Next Command**: `/speckit.tasks` to generate implementation task breakdown
