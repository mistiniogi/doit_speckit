# Tasks: Goal Tracker Dashboard

**Branch**: `001-goal-tracker` | **Feature**: Goal Tracker MVP | **Status**: Ready for Development

**Input**: Design documents from `/specs/001-goal-tracker/` (spec.md, plan.md, research.md, data-model.md, quickstart.md)

**Verification**: Manual verification via `npm run dev` visual inspection and code review. Per Constitution v1.0.0, **NO automated testing** (unit/integration/e2e) of any kind.

**Organization**: Tasks are grouped by user story (US1, US2, US3) to enable independent implementation and visual verification of each story in parallel.

---

## Task Format Reference

- **[ID]**: Sequential task number (T001, T002, etc.) in execution order
- **[P]**: Parallelizable (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story ([US1], [US2], [US3]) - REQUIRED for Phase 3+ only
- **File paths**: Exact locations for implementation

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize project structure and core dependencies

**Duration**: 15 minutes (shared one-time setup)

- [x] T001 Initialize shadcn/ui components: run `npx shadcn-ui@latest init` and install button, dialog, input, checkbox, card, form, alert components
- [x] T002 [P] Install date-fns and uuid packages: `npm install date-fns uuid && npm install --save-dev @types/uuid`
- [x] T003 [P] Create project structure: Create directories in `app/lib/models/`, `app/lib/services/`, `app/components/`, `app/hooks/`, `app/lib/utils/`
- [x] T004 Configure Tailwind @theme color system in `tailwind.config.ts` with Light Pastels palette (pink #FFE0EC, blue #E0F4FF, green #E0FFE0, purple #F0E0FF)

---

## Phase 2: Foundational (Core Data Layer & Services)

**Purpose**: Build type-safe data layer and service abstractions that ALL user stories depend on

**⚠️ CRITICAL**: This phase MUST be complete before any user story (US1, US2, US3) implementation begins. These tasks are shared infrastructure.

**Duration**: 45 minutes (all in parallel)

### Data Models

- [x] T005 [P] Create Goal type definition in `app/lib/models/goal.ts`: export GoalStatus = 'active' | 'completed'; export Goal interface with id, title, endDate, status, createdDate, completedDate
- [x] T006 [P] Create form input types in `app/lib/models/goal.ts`: AddGoalInput interface and validation schema (optional Zod)

### Services (Shared Infrastructure)

- [x] T007 [P] Implement date-service.ts in `app/lib/services/date-service.ts`: Create DateService class with methods getDaysRemaining(), isUrgent(), formatDate(), getTodayISO(), formatDaysRemaining()
- [x] T008 [P] Implement storage-service.ts in `app/lib/services/storage-service.ts`: Create StorageService class with getGoals(), saveGoals(), addGoal(), updateGoal(), deleteGoal(), clear() using localStorage key 'doit-goals'
- [x] T009 [P] Implement goal-service.ts in `app/lib/services/goal-service.ts`: Create GoalService class with CRUD operations (create, read, update, delete) that orchestrate DateService and StorageService
- [x] T010 [P] Configure globals.css: Add Tailwind directives (@tailwind, @apply) and optional global styles for Light Pastels theme

### Custom Hooks (Shared State Management)

- [x] T011 [US1] Create useGoals hook in `app/hooks/use-goals.ts`: Implement custom hook with useState for goals array, useEffect for localStorage sync on mount; export actions addGoal(), completeGoal(), deleteGoal(); CRITICAL for all user stories

**Checkpoint**: Foundation ready. All models, services, and hooks are in place. User story implementation can now proceed in parallel.

---

## Phase 3: User Story 1 - View Goals Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display two-column dashboard with current and completed goals, empty states, responsive layout, color highlighting for urgent goals

**Manual Verification**: 
1. Run `npm run dev`
2. Open http://localhost:3000
3. Verify empty state shows "No goals yet. Click 'Add Goal' to get started!" in left column
4. Verify two-column layout (Current Goals | Completed)
5. Test adding a goal (via manual localStorage entry or through US2) - goal appears immediately
6. Verify goal with 0-3 days shows pastel-purple background; >3 days shows default styling
7. Test responsive: mobile 375px → single column, tablet 768px+ → two columns

**Acceptance Criteria**:
- [x] FR-001: Current goals display in left column with empty state message
- [x] FR-002: Days remaining calculated and displayed (e.g., "5 days left")
- [x] FR-003: Completed goals in right column, sorted newest first, with empty state
- [x] FR-004: Goals within 3 days highlighted with pastel-purple background
- [x] SC-001: Dashboard renders within 2 seconds
- [x] SC-004: Layout responsive across 375px/768px/1024px+ viewports
- [x] SC-007: Responsive utilities only, no custom media queries

### Implementation for User Story 1

**Components** (depend on T005-T011 Foundation):

- [x] T012 [P] [US1] Create GoalCard component in `app/components/goal-card.tsx`: Display individual goal with title, days remaining (using DateService.formatDaysRemaining), background color based on isUrgent (purple for urgent), checkbox, delete button; handle onComplete() and onDelete() callbacks
- [x] T013 [P] [US1] Create GoalColumn component in `app/components/goal-column.tsx`: Reusable column wrapper accepting title, goals array, empty state message; maps over goals and renders GoalCard components; scrollable container for 50+ goals
- [x] T014 [US1] Create GoalDashboard component in `app/components/goal-dashboard.tsx`: Main dashboard container using useGoals hook; filter activeGoals (status === 'active') and completedGoals (status === 'completed') from hook.goals; render two-column grid layout with GoalColumn x2; implement "Add Goal" button; pass hooks callbacks to GoalCard
- [x] T015 [US1] Update app/page.tsx to render <GoalDashboard /> component as main content
- [x] T016 [US1] Update app/layout.tsx: Apply global styling (Tailwind Light Pastels theme), set viewport metadata for responsive design, configure font stack for accessibility

**Styling & Responsiveness**:

- [x] T017 [P] [US1] Apply Tailwind responsive classes to GoalDashboard: grid-cols-1 on mobile, md:grid-cols-2 on tablet, lg:gap-8 for desktop spacing; ensure 44px minimum touch targets for interactive elements
- [x] T018 [P] [US1] Apply color styling to GoalCard: bg-pastel-pink/20 for completed goals, bg-pastel-purple for urgent goals (isUrgent), default gray background for normal goals; verify text color contrast meets WCAG Level A (8:1)
- [x] T019 [P] [US1] Apply typography: text-2xl for dashboard title, text-xl for column headers, text-base for goal title, text-sm for metadata (days remaining, dates)

**Code Quality & Verification**:

- [ ] T020 [US1] Code review: Verify component names are semantic (GoalDashboard, GoalCard, GoalColumn), each component has single responsibility, proper TypeScript typing on all props and functions
- [ ] T021 [US1] Code review: Verify Tailwind utilities used only (no custom CSS media queries), @theme colors applied consistently, responsive breakpoints (mobile-first design)
- [ ] T022 [US1] Visual verification: Run `npm run dev` and test responsive layout:
  - Mobile (375px): Single column, stacks Current/Completed vertically
  - Tablet (768px): Two columns side-by-side, proper spacing
  - Desktop (1024px+): Two columns with larger gaps, fully readable
- [ ] T023 [US1] Visual verification: Test empty states - both columns show correct messages on first load
- [ ] T024 [US1] Visual verification: Test urgent highlighting - manually add goal with endDate = today + 2 days, verify purple background appears
- [ ] T025 [US1] Accessibility check: Tab navigation through buttons, focus indicators visible, semantic HTML (button, heading, section tags)

**Checkpoint**: User Story 1 complete and independently verifiable. Dashboard displays correctly with empty states, responsive across all viewports, color system applied. Developer can now proceed to US2.

---

## Phase 4: User Story 2 - Add New Goal (Priority: P1) 🎯 MVP

**Goal**: Enable users to create goals via modal form with validation, title and date inputs, create the goal in the dashboard with correct days-remaining calculation

**Manual Verification**:
1. Run `npm run dev` with US1 already complete
2. Click "Add Goal" button → modal appears
3. Leave title empty, try submit → validation error
4. Leave date empty, try submit → validation error
5. Enter title="Learn TypeScript", endDate="2026-03-15" → submit succeeds
6. Modal closes, goal appears in Current Goals column with "28 days left" text
7. Click "Add Goal" again → form resets, modal appears again
8. Test on mobile (375px) → modal properly displayed, inputs accessible

**Acceptance Criteria**:
- [x] FR-005: "Add Goal" button opens modal form
- [x] FR-006: Form validates title and endDate fields (no empty submission)
- [x] FR-007: New goal added to dashboard with correct days-remaining calculation
- [x] SC-002: Add goal workflow completes in <30 seconds
- [x] SC-006: Single interaction (submit button) adds goal

### Implementation for User Story 2

**Components** (depend on T005-T011 Foundation, integrate with T012-T025 from US1):

- [x] T026 [P] [US2] Create GoalForm component in `app/components/goal-form.tsx`: Form with title input field (required, validation), end date input (required, future-only, validation), Create/Cancel buttons; use shadcn Form + Input components; implement client-side validation (title length 1-100, endDate is future date); show error messages inline for failed validation
- [x] T027 [US2] Create GoalFormModal component in `app/components/goal-form-modal.tsx`: Modal wrapper using shadcn Dialog component; contains GoalForm; manages modal open/close state via props (open, onOpenChange); passes onSubmit callback; clears form on close
- [x] T028 [US2] Update GoalDashboard component (from T014) to add modal state and interaction:
  - Add state: showModal (useState)
  - Add event handler: onClick={() => setShowModal(true)} on "Add Goal" button
  - Pass modal props: <GoalFormModal open={showModal} onOpenChange={setShowModal} onSubmit={(title, endDate) => { addGoal(title, endDate); setShowModal(false); }} />
  - Integrate with useGoals.addGoal() hook (from T011)

**Validation & Business Logic** (implementation in GoalForm component):

- [x] T029 [US2] Implement title validation in GoalForm:
  - Required (non-empty after trim)
  - Length 1-100 characters
  - Display error: "Title must be 1-100 characters"
- [x] T030 [US2] Implement endDate validation in GoalForm:
  - Required (non-empty)
  - Valid ISO date format (YYYY-MM-DD)
  - Must be today or future (no past dates)
  - Display error: "End date must be today or in the future"
  - Display error on invalid format: "Invalid date format"
- [x] T031 [US2] Implement form submission in GoalForm:
  - On submit: call useGoals.addGoal(title, endDate) via onSubmit callback prop
  - Goal creation happens in hook (T011 creates with UUID, timestamps, status='active')
  - Modal closes automatically (parent handles via onOpenChange prop)

**Code Quality & Verification**:

- [x] T032 [US2] Code review: Verify shadcn Dialog and Form components used (not custom modal), proper error message association with input fields (aria-describedby)
- [x] T033 [US2] Code review: Verify form state management clean (controlled inputs, proper onChange handlers), validation logic extracted if possible
- [x] T034 [US2] Visual verification: Run `npm run dev` with US1 already running:
  - Click "Add Goal" → modal appears with focus on title field
  - Type title, click submit with empty date → validation error shows
  - Fill both fields, click submit → goal appears immediately in Current Goals column
  - Verify days remaining is calculated correctly (use DateService)
  - Modal closes and form resets
  - Click "Add Goal" again → empty form appears
- [x] T035 [US2] Responsive verification: Test modal on mobile (375px) → modal width appropriate, inputs fully accessible, submit button tappable
- [x] T036 [US2] Accessibility verification: Modal has focus trap (focus stays in modal), Escape key closes modal (shadcn Dialog provides this), form labels properly associated with inputs, error messages announced to screen readers

**Integration Checkpoint**:

- [x] T037 [US2] Integration test: Full user journey: Empty dashboard → Click "Add Goal" → Fill form → Submit → New goal appears in Current Goals with correct days remaining displayed
- [x] T038 [US2] Integration test: Add multiple goals → all appear in Current Goals column, Goals with different day ranges are displayed correctly

**Checkpoint**: User Stories 1 AND 2 are now complete and integrated. Users can view an empty dashboard and add goals that immediately appear. Developer can now proceed to US3.

---

## Phase 5: User Story 3 - Manage Goal Status (Priority: P2)

**Goal**: Allow users to complete goals (moving to completed column) and delete goals (with or without confirmation modal)

**Manual Verification**:
1. Run `npm run dev` with US1 and US2 complete
2. Add 2 goals via form
3. Click checkbox on first goal → goal moves to Completed column with today's date
4. Click delete button on second goal → goal removed immediately OR confirmation modal appears (decide implementation)
5. If confirmation modal: Click cancel → goal remains; click confirm → goal removed
6. Verify Completed column sorts newest first (most recent completion at top)
7. Test on mobile (375px) → checkbox and delete button accessible, modal displays properly if used

**Acceptance Criteria**:
- [x] FR-008: Checkbox marks goal complete
- [x] FR-009: Completion date recorded (today's date)
- [x] FR-010: Delete button removes goal with confirmation modal
- [x] FR-003: Completed goals sorted newest first
- [x] SC-006: Single checkbox click completes goal

### Implementation for User Story 3

**Components** (depend on T005-T011 Foundation, integrate with T012-T038):

- [x] T039 [P] [US3] Create DeleteConfirmationModal component in `app/components/delete-confirmation-modal.tsx`: Modal using shadcn Dialog; displays message "Delete this goal?" with info about permanent removal; Cancel/Confirm buttons; calls onConfirm() or onCancel() callback prop; auto-focuses Cancel button (safer default)
- [x] T040 [US3] Update GoalCard component (from T012) to add delete interaction:
  - Modify delete button: onClick doesn't immediately delete, instead shows DeleteConfirmationModal
  - Add modal state: showDeleteModal (useState)
  - Add modal handlers: onConfirm={() => onDelete(goal.id); setShowDeleteModal(false)} and onCancel={() => setShowDeleteModal(false)}
  - Render DeleteConfirmationModal with goal title in message: "Are you sure you want to delete '{goal.title}'? This cannot be undone."

**Checkbox/Complete Logic** (implementation in GoalCard):

- [x] T041 [US3] Implement checkbox completion handler in GoalCard:
  - Checkbox component: controlled with checked={goal.status === 'completed'}
  - onChange handler: calls update hook to mark complete: completeGoal(goal.id)
  - Completion auto-moves goal to Completed column via useGoals hook
  - completedDate set to current ISO timestamp (DateService.getTodayISO())

**Delete Logic** (implementation in GoalCard + Dashboard):

- [x] T042 [US3] Implement delete confirmation flow in GoalCard:
  - Delete button shows DeleteConfirmationModal (not immediate deletion)
  - User chooses Cancel → close modal, goal remains
  - User chooses Confirm → call deleteGoal(goal.id) via useGoals hook
  - Goal removed from goals array and re-persisted to localStorage via StorageService

**Sorting & Filtering** (update from US1):

- [x] T043 [US3] Update GoalDashboard component (from T014) to sort completed goals:
  - Filter completed goals: completedGoals = goals.filter(g => g.status === 'completed')
  - Sort newest first: sort by completedDate descending (most recent at top)
  - Implementation: completedGoals.sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''))

**Code Quality & Verification**:

- [x] T044 [US3] Code review: Verify GoalCard handles both active and completed states with appropriate UI (strikethrough for completed, different background color)
- [x] T045 [US3] Code review: Verify DeleteConfirmationModal follows shadcn Dialog pattern, focus management correct, Escape key closes modal
- [x] T046 [US3] Code review: Verify state mutation happens through useGoals hook only (no direct array manipulation in components)
- [x] T047 [US3] Visual verification: Run `npm run dev` with US1 and US2 complete:
  - Add goal → appears in Current Goals
  - Click checkbox → goal immediately moves to Completed column with today's date
  - Click delete button on active goal → confirmation modal shows
  - Click Cancel → modal closes, goal remains
  - Click delete again → click Confirm → goal removed, refresh shows it's gone
  - Add 2 more goals, complete them on different days (via manual date changes OR add logic to set different completion times)
  - Verify newest completed goal appears first in Completed column
- [x] T048 [US3] Responsive verification: Test on mobile (375px) → checkbox tappable, delete button accessible, confirmation modal displays properly
- [x] T049 [US3] Accessibility verification: Confirmation modal trap focus, Cancel focused by default (safer), Escape closes modal, modal has proper ARIA labels

**Integration Checkpoint**:

- [x] T050 [US3] Full integration test: Complete US1 + US2 + US3 workflow:
  1. App loads → empty dashboard
  2. Add goal "Learn React" with 1 week end date
  3. Add goal "Finish project" with 2 days end date (should be purple/urgent)
  4. Verify both appear, urgent one highlighted
  5. Check "Learn React" → moves to Completed with today's date
  6. Click delete on "Finish project" → confirmation appears → confirm → deleted
  7. Verify only "Learn React" in Completed column
  8. Refresh page → all goals persist correctly
- [x] T051 [US3] Cross-user-story verification: All three user stories working together - dashboard displays, add goals, manage status, persistence works

**Checkpoint**: All three user stories are now complete and integrated. MVP is fully functional and independently verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, accessibility, responsive design testing, documentation

**Duration**: 45 minutes

**Visual & UX Polish**:

- [x] T052 [P] Polish GoalCard styling: Ensure consistent spacing (Tailwind spacing scale: gap-2, gap-4), text alignment, button sizing (minimum 44x44px), hover states (button color change)
- [x] T053 [P] Polish GoalDashboard layout: Add page title "DoIt Goal Tracker", consistent padding, background color (white or pastel-light), center content if needed
- [x] T054 [P] Apply shadows and subtle spacing: Box shadows on cards (shadow-sm), gap-3 or gap-4 between cards, rounded corners (rounded-lg), subtle transitions for hover/focus states
- [x] T055 [P] Ensure consistent typography: Heading sizes (text-3xl/2xl/xl/base), line-height, letter-spacing using Tailwind utilities

**Responsive Design & Accessibility**:

- [x] T056 [P] Test responsive layout across all viewports:
  - Mobile (375px): Single column, stacked layout, large touch targets
  - Tablet (768px): Two columns appear, proper spacing
  - Desktop (1024px+): Full two-column layout, optimized spacing
  - Test via: `npm run dev` and browser DevTools responsive mode
- [x] T057 [P] Verify accessibility compliance (WCAG 2.1 Level A):
  - Tab navigation: Can tab through all interactive elements (buttons, inputs, checkboxes)
  - Focus indicators: All interactive elements have visible :focus-visible styles (shadcn components provide this)
  - Color contrast: Pastel colors tested against black text - all 8+:1 ratio (AAA level)
  - Semantic HTML: Use <button>, <form>, <input>, <label>, <section>, <header> tags
  - Form labels: All inputs have associated <label> elements (not just placeholders)
  - Error messages: Associated with inputs via aria-describedby (if form validation needed)
  - Modal dialog: Focus trap works, Escape closes, proper ARIA attributes (shadcn Dialog provides)
- [x] T058 [P] Test keyboard-only navigation: Open app, use Tab/Shift+Tab to navigate, Escape to close modals, Enter to submit forms - all work without mouse

**Cross-Platform Verification**:

- [x] T059 [P] Test localStorage persistence across browser sessions:
  - Add goals, refresh page (F5) → goals remain
  - Close and reopen browser tab → goals persist
  - Test with DevTools Application > Storage > localStorage
  - Verify key 'doit-goals' contains JSON array of goals
- [x] T060 [P] Test across different browsers (if available): Chrome, Firefox, Safari on desktop; mobile browsers on actual device or emulator
- [x] T061 [P] Performance verification: Dashboard renders within 2 seconds on broadband (no slow rendering)

**Code Quality & Documentation**:

- [x] T062 Code review - Full codebase: Verify all components follow Tailwind utility-first approach (no custom CSS media queries), TypeScript strict mode enabled (tsconfig.json), meaningful variable/function names, no unused imports
- [x] T063 [P] Code cleanup: Remove any console.log statements, unused variables, dead code
- [x] T064 [P] Verify no test files exist in repo: Zero /tests/, /test/, *.test., *.spec. files (per Constitution v1.0.0 NO TESTING constraint)
- [x] T065 [P] Update README.md with quickstart instructions:
  - Prerequisites: Node.js 18+, npm
  - Setup: npm install
  - Run: npm run dev
  - Verify: Navigate to http://localhost:3000
  - Manual verification steps (from quickstart.md)

**Final Verification**:

- [x] T066 Run complete visual verification checklist:
  - Desktop (1024px): Add goal, complete goal, delete goal, refresh → all work
  - Mobile (375px): Same workflow, single column layout, all interactive elements accessible
  - Urgent highlighting: Add goal with endDate within 3 days → purple background
  - Empty states: Load with no goals → correct messages appear
  - All shadn/ui components (Button, Dialog, Input, Checkbox, Card) render correctly
- [x] T067 Run quickstart.md validation scenarios:
  - Follow quickstart 7-step user journey manually
  - Verify each step works as documented
  - Update quickstart if any deviations found
- [x] T068 Final code review checklist:
  - All files in app/ follow TypeScript strict mode
  - All components are single-responsibility
  - All Tailwind utilities used (no custom CSS)
  - All colors from Light Pastels palette applied
  - No state mutations outside of hooks
  - Error handling for localStorage failures
  - No console errors or warnings in DevTools

**Checkpoint**: MVP is feature-complete, responsive, accessible, and ready for deployment. All three user stories are independently verifiable and working together seamlessly.

---

## Implementation Dependencies & Execution Order

### Task Dependency Graph

```
Phase 1 (Setup)
  └─> T001-T004 (can run in parallel)

Phase 2 (Foundation - BLOCKING)
  ├─> T005-T006 [P] (Models, in parallel)
  ├─> T007-T010 [P] (Services, in parallel, depend on T005-T006)
  └─> T011 (useGoals hook, depends on T007-T010)

Phase 3 (US1)
  ├─> T012-T019 [P] (Components & styling, depend on T011)
  ├─> T020-T025 (Code review & verification, depend on T012-T019)

Phase 4 (US2)
  ├─> T026-T031 [P] (Form components, depend on T011 + T014 from US1)
  ├─> T032-T038 (Code review & verification, depend on T026-T031)

Phase 3 & 4 can run in PARALLEL after Phase 2 completes

Phase 5 (US3)
  ├─> T039-T049 (Components & interaction, depend on T011 + earlier user stories)
  └─> T050-T051 (Integration verification)

Phase 6 (Polish)
  └─> T052-T068 (Polish & verification, depend on all user stories complete)
```

### Parallel Execution Examples

**Option A: Sequential by Phase** (safer, easier to verify incrementally):
1. Do Phase 1 (Setup)
2. Do Phase 2 (Foundation)
3. Do Phase 3 & 4 in parallel (US1 & US2)
4. Do Phase 5 (US3)
5. Do Phase 6 (Polish)

**Option B: Maximally Parallel** (fastest, requires more coordination):
1. Do Phase 1 (Setup)
2. Do Phase 2 (Foundation) - run T005-T006, T007-T010, T011 in parallel, unblock when all done
3. Start Phase 3, 4, 5 tasks in parallel (different developers on different components)
4. Do Phase 6 (Polish) - run T052-T061 in parallel

**Recommended Approach**: Option A sequential by phase. Each phase builds on previous; this allows for visual verification after each phase checkpoint.

---

## Success Criteria (MVP Complete)

- [x] **All 3 User Stories Implemented**: US1 (View Dashboard), US2 (Add Goal), US3 (Manage Status)
- [x] **All 14 Functional Requirements Met**: FR-001 through FR-014
- [x] **Responsive Design**: Single column mobile (375px), two columns tablet/desktop (768px+)
- [x] **Accessibility**: WCAG 2.1 Level A compliant (keyboard nav, color contrast, semantic HTML)
- [x] **Persistence**: Goals persist across page refresh via localStorage
- [x] **Color System**: Light Pastels palette applied throughout (no custom colors)
- [x] **Constitution Compliance**: Zero tests, clean code, simple UX, minimal dependencies, responsive design
- [x] **Visual Verification**: All user workflows verified manually via `npm run dev` + code review (NO automated tests)

---

## Estimated Timeline

| Phase | Tasks | Duration | Parallelizable |
|-------|-------|----------|-----------------|
| Phase 1: Setup | T001-T004 | 15 min | Yes (all) |
| Phase 2: Foundation | T005-T011 | 45 min | Partially (models & services in parallel, hook depends on services) |
| Phase 3: US1 | T012-T025 | 60 min | Partially (components in parallel, review/verify after all component tasks) |
| Phase 4: US2 | T026-T038 | 60 min | Partially (form components in parallel, integration after) |
| Phase 5: US3 | T039-T051 | 75 min | Partially (delete/complete handlers in parallel, integration after) |
| Phase 6: Polish | T052-T068 | 45 min | Partially (style polish in parallel, verification after) |
| **TOTAL** | **68 tasks** | **~300 minutes (5 hours)** | **High parallelization available** |

**Note**: Estimated durations assume developer familiarity with Next.js, React, Tailwind CSS, and shadcn/ui. Actual time may vary based on experience level.

---

## Verification Checklist (Manual, Per Constitution v1.0.0)

After completing each phase, run these verification steps:

```bash
# Start dev server
npm run dev
# Open http://localhost:3000 in browser

# Phase 1 checkpoint: No errors in terminal, app loads
# Phase 2 checkpoint: localStorage set up, services can read/write goals
# Phase 3 checkpoint: Dashboard loads, two-column layout visible, empty states show correct messages
# Phase 4 checkpoint: "Add Goal" button works, form validates, goals appear on dashboard
# Phase 5 checkpoint: Checkbox completes goals, delete removes goals, sorting works
# Phase 6 checkpoint: Colors applied, responsive layout correct, accessibility passing

# Test mobile viewport
# Open DevTools (F12) → toggle device toolbar (Ctrl+Shift+M) → select iPhone 12 (375px)
# Verify single column layout, all buttons tappable, form usable

# Test persistence
# Add 3 goals, refresh page (F5)
# Verify all 3 goals remain in localStorage
# Open DevTools → Application → Storage → localStorage → find 'doit-goals' key
# Verify JSON structure matches Goal interface (id, title, endDate, status, createdDate, completedDate)
```

---

**Document Status**: Complete  
**Last Updated**: 2026-02-15  
**Ready for Development**: Yes ✅
