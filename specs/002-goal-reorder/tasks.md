# Implementation Tasks: Goal Reordering via Drag-and-Drop

**Feature**: Goal Reordering via Drag-and-Drop  
**Branch**: `002-goal-reorder`  
**Specification**: [specs/002-goal-reorder/spec.md](spec.md)  
**Plan**: [specs/002-goal-reorder/plan.md](plan.md)  
**Generated**: 2026-02-15  

**Format Note**: Each task follows the checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

---

## Implementation Overview

This tasks document breaks down the Goal Reordering feature into 7 implementation phases:
- **Phase 1**: Setup & Dependencies (Sortable.js installation, Constitution amendment)
- **Phase 2**: Foundational Services (GoalOrderService, GoalStorageService, storage utilities)
- **Phase 3**: Core Drag-and-Drop (Active Goals column reordering) [P1 - User Story 1]
- **Phase 4**: Visual Feedback (Drop indicators, cursor changes, opacity) [P1 - User Story 3]
- **Phase 5**: Completed Goals Reordering [P2 - User Story 2]
- **Phase 6**: Drag Prevention on Buttons [P2 - User Story 4]
- **Phase 7**: Polish & Accessibility

**MVP Scope**: Complete Phase 1-4 for minimum viable product (P1 stories only)

**Parallel Opportunities**: 
- Phase 2 tasks can be completed in parallel (services are independent)
- Phase 3 and Phase 5 can be parallelized after Phase 2 (column logic is isolated)

---

## Phase 1: Setup & Dependencies

**Goal**: Install Sortable.js library and amend Constitution to allow the new dependency.

**Independent Test Criteria**:
- `npm list sortable` shows Sortable.js installed with correct version
- Sortable.js type definitions available in TypeScript
- Constitution v1.1.0 documents Sortable.js as approved dependency

### Setup Tasks

- [x] T001 Install Sortable.js and type definitions in package.json
  - Run: `npm install sortable @types/sortable --save`
  - Update `package.json` with pinned versions
  - Verify: `npm list sortable` shows installed version

- [x] T002 Update Constitution from v1.0.0 to v1.1.0 in `.specify/memory/constitution.md`
  - Add Sortable.js to "Locked versions" section with version pin
  - Update version line: `**Version**: 1.1.0`
  - Add amendment footer documenting this change
  - File: [.specify/memory/constitution.md](.specify/memory/constitution.md)

- [x] T003 [P] Add Sortable.js to gitignore exclusions if needed
  - Verify `node_modules/` is in `.gitignore`
  - Ensure `package-lock.json` is committed for version consistency

---

## Phase 2: Foundational Services & Utilities

**Goal**: Implement all shared business logic and persistence services that other features depend on.

**Independent Test Criteria**:
- Manually test each service function in Node REPL or quick test via `npm run dev` console
- localStorage persists test data correctly
- Cross-tab communication works (open two browser windows, change data in one, verify other updates)

### Foundational Tasks

- [x] T004 [P] Create GoalOrderService in `app/lib/services/goal-order-service.ts`
  - Implement `reorderGoalsInColumn()` - move goal to new position within column
  - Implement `getGoalsInStatus()` - return goals filtered and sorted by order
  - Implement `completeGoal()` - move goal to completed with new order value
  - Implement `deleteGoal()` - remove goal and repair order values
  - Implement `validateGoalOrder()` - check for contiguous order values
  - Implement `repairGoalOrder()` - fix missing/invalid order values (migration)
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 2)

- [x] T005 [P] Create GoalStorageService in `app/lib/services/goal-storage-service.ts`
  - Implement `loadGoals()` - load from localStorage, auto-migrate order property
  - Implement `saveGoals()` - persist to localStorage, emit custom event
  - Implement `onStorageChange()` - subscribe to cross-tab storage events
  - Implement `clearGoals()` - destructive clear (backup first!)
  - Implement `validateStorageIntegrity()` - check for corruption
  - Handle storage events: listen on window 'storage' event for cross-tab sync
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 3)

- [x] T006 [P] Create useSortableGoals hook in `app/hooks/use-sortable-goals.ts`
  - Initialize Sortable.js instance in useEffect with config (handle, ghostClass, callbacks)
  - Manage isDragging state for visual feedback
  - Call `GoalOrderService.reorderGoalsInColumn()` on drag end
  - Cleanup Sortable instance on unmount
  - Return: sortableRef, draggedGoalId, isDragging, setIsDragging
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 4)

- [x] T007 [P] Create useGoalCrossSyncStorage hook in `app/hooks/use-goal-cross-sync-storage.ts`
  - Subscribe to storage changes via `GoalStorageService.onStorageChange()`
  - Call onGoalsChange callback when storage updates detected
  - Cleanup event listeners on unmount
  - Skip self-updates (don't react to changes from same tab)
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 5)

- [x] T008 Extend Goal model with order property in `app/lib/models/goal.ts`
  - Add `order: number` field to Goal interface
  - Add validation: order >= 0
  - Update goal creation helper to set initial order
  - File: [app/lib/models/goal.ts](app/lib/models/goal.ts)
  - Per data model: [specs/002-goal-reorder/data-model.md](data-model.md)

---

## Phase 3: Core Drag-and-Drop in Active Goals Column [P1 - User Story 1]

**User Story 1 Goal**: As a user, I want to drag and drop goals in the active goals column to arrange them in the order that makes sense for my own priority system.

**Independent Test Criteria**:
- Open app, add 3+ active goals
- Drag first goal to position 3 → goal moves, others shift up
- Refresh page → goal remains in position 3 (persistence)
- Drop indicator appears during drag (position preview)
- Cursor changes to 'grab' on hover, 'grabbing' during drag

**Acceptance Criteria** (from spec):
1. ✅ Drag goal from position 1 to position 3 → goal moves to 3, others shift
2. ✅ Drop indicator appears showing where goal will land
3. ✅ Can cancel drag by releasing outside column → goal returns to original position
4. ✅ Goal order persists after page refresh

### User Story 1 Tasks

- [x] T009 [US1] Update GoalCard component to support draggable state in `app/components/goal-card.tsx`
  - Add isDragging prop to GoalCardProps
  - Apply `opacity-50` conditional class when isDragging true
  - Add `data-id={goal.id}` attribute for Sortable.js identification
  - Ensure buttons have `pointer-events: auto` to stay clickable
  - File: [app/components/goal-card.tsx](app/components/goal-card.tsx)

- [x] T010 [US1] Create GoalColumn component with Sortable.js integration in `app/components/goal-column.tsx`
  - New component that wraps a list of goals with Sortable.js
  - Use useSortableGoals hook to initialize Sortable instance
  - Pass sortableRef to `<ul class="sortable-list">`
  - Render goals as `<li data-id={goal.id}>` with GoalCard inside
  - Pass isDragging and draggedGoalId to GoalCard
  - Call onReorder callback after drag completes
  - Handle empty state message (from props)
  - File: [app/components/goal-column.tsx](app/components/goal-column.tsx)
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 6)

- [x] T011 [US1] Update GoalDashboard component to use new GoalColumn in `app/components/goal-dashboard.tsx`
  - Replace old goal rendering with two `<GoalColumn>` instances (active + completed)
  - Manage goals state with useState
  - Load goals on mount from GoalStorageService.loadGoals()
  - Pass onReorder callback → calls GoalStorageService.saveGoals() + setGoals()
  - Separate goals into activeGoals and completedGoals via filtering
  - Subscribe to cross-tab sync via useGoalCrossSyncStorage hook
  - File: [app/components/goal-dashboard.tsx](app/components/goal-dashboard.tsx)
  - Per contract: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
  - Code example: [specs/002-goal-reorder/quickstart.md](quickstart.md) (Step 7)

- [x] T012 [US1] Add Tailwind CSS classes for drag-and-drop styling in `app/globals.css`
  - `.drag-handle { @apply cursor-grab; }`
  - `.drag-handle:active { @apply cursor-grabbing; }`
  - `.sortable-ghost { @apply opacity-50; }` (Sortable.js class)
  - `.goal-column { @apply flex-1 bg-white rounded-lg shadow p-6; }`
  - `.goal-list { @apply space-y-2 list-none; }`
  - File: [app/globals.css](app/globals.css)

- [x] T013 [US1] Test drag-and-drop in active goals column via `npm run dev`
  - Open http://localhost:3000
  - Add 3-4 active goals
  - Drag first goal to last position → verify goal moves, order updates
  - Refresh page → verify goal remains in new position (localStorage persistence)
  - Drag goal back to original position → verify order reverts
  - Check console for no errors

---

## Phase 4: Visual Feedback During Drag [P1 - User Story 3]

**User Story 3 Goal**: As a user, I want clear visual feedback while dragging so I understand exactly what will happen when I release the goal.

**Independent Test Criteria**:
- Hover over goal → cursor changes to grab icon
- Click and hold goal → cursor changes to grabbing icon
- During drag: dragged goal appears semi-transparent (opacity 50%)
- During drag: drop indicator line/highlight appears below target goal
- Release goal → dragged goal returns to full opacity, appears in new position

**Acceptance Criteria** (from spec):
1. ✅ Cursor changes to 'grab' when hovering over goal
2. ✅ Dragged goal appears ghosted/semi-transparent during drag
3. ✅ Drop indicator updates to show new drop position as cursor moves
4. ✅ On drop, dragged goal returns to full opacity in new position

### User Story 3 Tasks

- [x] T014 [P] [US3] Update GoalColumn to display drop indicator during drag in `app/components/goal-column.tsx`
  - Add state to track hover position during drag (dropIndex)
  - Render `<li class="drop-indicator">` at appropriate index while dragging
  - Drop indicator: horizontal line with Tailwind classes
  - Hide indicator when not dragging
  - Update position as Sortable reports dragover events (if needed via Sortable callbacks)

- [x] T015 [US3] Add drop indicator styling to `app/globals.css`
  - `.drop-indicator { @apply border-t-2 border-blue-400 my-2; }`
  - `.drop-indicator::before { content: ""; @apply block h-0; }` (if spacing needed)
  - Ensure indicator is 1-2px thick, clearly visible

- [x] T016 [US3] Verify cursor changes in GoalCard on hover in `app/components/goal-card.tsx`
  - Ensure parent `<div>` has `className="cursor-grab"`
  - Add Tailwind class: `@apply cursor-grab`
  - During drag, Sortable.js automatically applies cursor-grabbing (via useSortableGoals)
  - Test: hover over goal → grab cursor appears

- [x] T017 [US3] Verify ghosted appearance via Sortable.js config in `app/hooks/use-sortable-goals.ts`
  - Config already sets `ghostClass: 'opacity-50'` in Sortable options
  - Verify GoalCard applies this class conditionally via isDragging prop
  - Tailwind will apply opacity automatically via Sortable.js class manipulation
  - Test: drag goal → goal becomes semi-transparent during drag

- [x] T018 [US3] Test visual feedback via `npm run dev`
  - Open http://localhost:3000, add goals
  - Hover over goal → cursor changes to grab
  - Click and drag goal → cursor changes to grabbing
  - During drag → goal is semi-transparent (opacity 50%), drop indicator appears
  - Drop goal → goal returns to full opacity in new position
  - Screenshot/video optional for documentation

---

## Phase 4.5: Auto-Scroll Handling [P1 - User Story 1 + Edge Case]

**Requirement**: FR-012 - When a user drags a goal near the edge of a scrollable goals column, the system MUST auto-scroll the column to allow the user to drop the goal in areas that may be off-screen.

**Independent Test Criteria**:
- Add 15+ goals to create a scrollable column
- Drag goal and move cursor within 50px of top edge → column scrolls up
- Drag goal and move cursor within 50px of bottom edge → column scrolls down
- Dragged goal remains visible during auto-scroll
- Scroll acceleration increases as cursor gets closer to edge
- Release goal while auto-scrolling → goal drops at correct position in scrolled area

**Acceptance Criteria** (from spec FR-012):
1. ✅ Dragging goal near column edge triggers auto-scroll
2. ✅ Auto-scroll allows dropping goals in off-screen areas
3. ✅ Dragged goal visibility maintained during scroll
4. ✅ Performance remains smooth (no jank during scroll + drag)

### Auto-Scroll Tasks

- [x] T018a [US1] Implement auto-scroll behavior in GoalColumn component in `app/components/goal-column.tsx`
  - Detect when dragged goal is within 50px of column top/bottom edges
  - Trigger auto-scroll with acceleration: base 10px + additional based on proximity
  - Scroll speed increases as cursor approaches edge (e.g., 5px/100ms at 50px distance, 15px/100ms at edge)
  - Max scroll: 20px per 100ms to prevent overshooting
  - Use `scrollIntoView()` or manual `scrollTop` adjustment
  - Stop scrolling when drag ends or cursor moves away from edge
  - File: [app/components/goal-column.tsx](app/components/goal-column.tsx)

- [x] T018b [US1] Enhance useSortableGoals hook to support edge-based scroll detection in `app/hooks/use-sortable-goals.ts`
  - Add dragover/dragmove callback to determine cursor proximity to edges
  - Calculate onDragOver: distance from cursor to column edges
  - Trigger parent scroll action if within threshold (50px)
  - Return scroll state to caller (GoalColumn)
  - Pass scroll handler to Sortable.js config
  - File: [app/hooks/use-sortable-goals.ts](app/hooks/use-sortable-goals.ts)

- [x] T018c [US1] Test auto-scroll behavior via `npm run dev`
  - Add 15-20 goals to create scrollable column
  - Drag goal from position 1
  - Move dragged goal to within 50px of top edge → verify column scrolls up
  - Move to within 50px of bottom edge → verify column scrolls down
  - Drag goal to off-screen position (e.g., position 20 near bottom) and drop
  - Verify dropped goal appears in correct position after scroll
  - Verify no jank or performance degradation during scroll + drag

---

## Phase 5: Completed Goals Column Reordering [P2 - User Story 2]

**User Story 2 Goal**: As a user, I want to reorder my completed goals by dragging them in the completed column so I can organize them by completion date, difficulty, or any other personal preference.

**Independent Test Criteria**:
- Complete a goal (checkbox) → moves to completed column
- Drag goal within completed column → reorders successfully
- Refresh page → completed goal order persists
- Can drag goals in both columns independently

**Acceptance Criteria** (from spec):
1. ✅ Drag goal within completed column → moves to new position
2. ✅ Refresh page → completed goal remains in new position

### User Story 2 Tasks

- [x] T019 [US2] Ensure GoalOrderService handles completed goals correctly in `app/lib/services/goal-order-service.ts`
  - Verify `reorderGoalsInColumn()` works for status='completed'
  - Verify `completeGoal()` assigns correct order (max + 1) in completed group
  - Test via code review: logic is identical for both status values

- [x] T020 [US2] Verify GoalDashboard renders completed column in `app/components/goal-dashboard.tsx`
  - Second GoalColumn with status="completed"
  - Pass correspondingGoals (completedGoals filtered and sorted by order)
  - onReorder callback should save to localStorage
  - Status filtering should work independently per column

- [x] T021 [US2] Test completed goals reordering via `npm run dev`
  - Add 2-3 goals and mark them complete (checkbox)
  - Verify goals move to completed column
  - Drag goal within completed column → should reorder like active column
  - Refresh page → completed goal order persists
  - Verify active and completed columns have independent ordering

---

## Phase 6: Prevent Accidental Drag on Interactive Elements [P2 - User Story 4]

**User Story 4 Goal**: As a user, I want to prevent accidentally triggering drag operations when I'm trying to interact with goal elements like checkboxes or delete buttons.

**Independent Test Criteria**:
- Click and hold checkbox → checkbox changes state, no drag initiated
- Click and hold delete button → delete confirmation appears, no drag initiated
- Click and hold goal title/neutral area → drag operation initiates normally

**Acceptance Criteria** (from spec):
1. ✅ Click checkbox → drag not initiated, only checkbox interacts
2. ✅ Click delete button → drag not initiated, delete modal appears
3. ✅ Click goal title/neutral area → drag operation initiates normally

### User Story 4 Tasks

- [x] T022 [US4] Configure Sortable.js to exclude interactive elements in `app/hooks/use-sortable-goals.ts`
  - Set `handle: '.drag-handle'` to limit drag to specific area, OR
  - Set `filter: 'button,input,a'` to exclude buttons and inputs from drag
  - Recommended: Use handle approach for explicit control
  - File: [app/hooks/use-sortable-goals.ts](app/hooks/use-sortable-goals.ts)

- [x] T023 [US4] Update GoalCard component to mark interactive elements safely in `app/components/goal-card.tsx`
  - Complete button: add `data-no-drag="true"` attribute
  - Delete button: add `data-no-drag="true"` attribute
  - Ensure buttons have sufficient z-index and pointer-events to catch clicks
  - Optional: Add `.drag-handle` span as placeholder for drag affordance

- [x] T024 [US4] Test interactive elements don't trigger drag via `npm run dev`
  - Goal with checkbox: click and hold checkbox → checkbox toggles, no drag
  - Goal with delete button: click delete → confirmation modal appears, no drag
  - Goal title area: click and drag → drag operation initiates
  - Test mouse and touch (if device available)

- [x] T024a [FR-008] Test drag cancellation when goal status changes during drag in `npm run dev`
  - Start dragging a goal from active column
  - While dragging, use a second browser tab or DevTools to mark the goal complete
  - Verify: In-progress drag operation is cancelled automatically
  - Verify: Goal moves to completed column (status change processed)
  - Verify: Dragged goal does NOT appear in old position; appears in correct new location
  - Verify: No UI errors or console warnings
  - Per FR-008: "System MUST cancel any in-progress drag operation if the goal's status changes"

---

## Phase 4.25: Keyboard Accessibility [P1 - User Story 3 + Accessibility]

**Requirement**: FR-010 - The system MUST support keyboard accessibility for drag-and-drop operations using standard patterns.

**NOTE**: Moved from Phase 7 (Polish) to Phase 4 because FR-010 is a MANDATORY feature (MUST), not a polish item. Accessibility must be part of core feature implementation, not deferred.

### Keyboard Accessibility Tasks

- [x] T025 [P] [FR-010] Add keyboard accessibility for drag-and-drop in `app/hooks/use-sortable-goals.ts`
  - Enable Sortable.js keyboard support: `forceFallback: true` for full keyboard drag handling
  - Document keyboard shortcuts: Focus goal → Space/Enter to enter drag mode → Arrow keys to reorder → Enter to confirm, Escape to cancel
  - Implement custom keyboard handler that maps keys to Sortable.js drag actions
  - Ensure goal cards are keyboard-focusable (tab navigation works)
  - Test: Tab to goal → Space key enters drag mode → Arrow keys move goal → Enter drops at new position
  - File: [app/hooks/use-sortable-goals.ts](app/hooks/use-sortable-goals.ts)
  - Per FR-010: keyboard accessibility required for all users

- [x] T025b [P] [FR-010] Test keyboard accessibility for drag-and-drop via `npm run dev`
  - Open app with goals visible
  - Tab navigation: Press Tab repeatedly until focus lands on a goal card
  - Verify: Goal card receives visual focus indicator (border or outline)
  - Press Space or Enter: Verify drag mode activates (visual feedback)
  - Use Arrow keys (Up/Down): Verify goal moves up/down in column
  - Press Enter: Verify goal drops at new position
  - Press Escape: Verify drag mode cancels, goal returns to original position
  - Test in multiple browsers (Chrome, Firefox, Safari)
  - Test with screen reader (NVDA or JAWS) if available
  - Per SC-008: "Keyboard accessibility (focus, Space/Enter, arrow keys) allows keyboard-only users to reorder goals without using mouse/touch"

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Ensure responsive design, error handling, data validation, and cross-browser compatibility.

### Polish Tasks

- [x] T026 [P] Test responsive design across viewports
  - Mobile (375px): GoalColumn should stack or use single-column layout
  - Tablet (768px): Two columns visible side-by-side
  - Desktop (1024px+): Full two-column layout with good spacing
  - Test drag-and-drop works on all sizes via `npm run dev`

- [x] T027 [P] Add error handling for localStorage failures in `app/lib/services/goal-storage-service.ts`
  - Wrap localStorage access in try-catch
  - Log errors to console (visible during `npm run dev`)
  - Fallback: in-memory goals if localStorage fails
  - Notify user if save failed (optional UI, low priority for MVP)
  - File: [app/lib/services/goal-storage-service.ts](app/lib/services/goal-storage-service.ts)

- [x] T028 [P] Validate data integrity on load in `app/lib/services/goal-storage-service.ts`
  - Call `GoalOrderService.validateGoalOrder()` on each status group
  - Call `GoalOrderService.repairGoalOrder()` if validation fails
  - Prevents corrupted order from breaking UI
  - Silent repair is acceptable for MVP

- [x] T029 Test cross-tab synchronization via `npm run dev`
  - Open app in two browser tabs
  - Make changes (add/complete/reorder) in Tab 1
  - Verify Tab 2 updates automatically via storage events
  - Test radio buttons or other controls work across tabs

- [x] T030 Verify no console errors
  - Open http://localhost:3000 with DevTools console open (F12)
  - Perform all dragging operations
  - Manual verification: no red error messages
  - Verify all tasks completed successfully

- [x] T031 Code review: Verify all implementations match contracts in `app/components/goal-*.tsx` and `app/lib/services/*.ts`
  - Check component props match GoalColumnProps, DraggableGoalCardProps
  - Check service functions match GoalOrderService, GoalStorageService contracts
  - Check hook signatures match useSortableGoals, useGoalCrossSyncStorage
  - Refer to: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)

- [x] T032 Update or create README/CHANGELOG with feature completion notes
  - Document Sortable.js installation
  - List new components: GoalColumn, updated GoalCard, updated GoalDashboard
  - List new services: GoalOrderService, GoalStorageService
  - List new hooks: useSortableGoals, useGoalCrossSyncStorage
  - Performance note: localStorage-based, no backend sync
  - Break note: Constitution v1.1.0 required

---

## Dependency Graph & Execution Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational Services)
    ├─→ T004: GoalOrderService
    ├─→ T005: GoalStorageService
    ├─→ T006: useSortableGoals hook
    ├─→ T007: useGoalCrossSyncStorage hook
    └─→ T008: Goal model extension

Phase 2 Complete ↓

Phase 3 (US1: Active Goals Drag)
    ├─→ T009: GoalCard (draggable state)
    ├─→ T010: GoalColumn (Sortable integration)
    ├─→ T011: GoalDashboard (coordinate columns)
    ├─→ T012: Tailwind styling
    └─→ T013: Manual test

Phase 4 (US3: Visual Feedback) [Can run parallel with Phase 5]
    ├─→ T014: Drop indicator rendering
    ├─→ T015: Indicator styling
    ├─→ T016: Cursor on hover
    ├─→ T017: Ghosted appearance
    └─→ T018: Manual test

Phase 5 (US2: Completed Goals) [Can run parallel with Phase 4]
    ├─→ T019: Service validation
    ├─→ T020: Dashboard rendering
    └─→ T021: Manual test

Phase 6 (US4: Drag Prevention)
    ├─→ T022: Sortable config (handle/filter)
    ├─→ T023: Mark interactive elements
    └─→ T024: Manual test

Phase 4.25 (Keyboard Accessibility - moved from Phase 7)
    ├─→ T025: Keyboard drag-and-drop support
    └─→ T025b: Keyboard accessibility testing

Phase 4.5 (Auto-Scroll Handling - NEW for FR-012)
    ├─→ T018a: Auto-scroll implementation
    ├─→ T018b: Scroll detection in hook
    └─→ T018c: Auto-scroll testing

Phase 6 Extended (Drag Prevention + Status Change)
    ├─→ T022: Sortable config (handle/filter)
    ├─→ T023: Mark interactive elements
    ├─→ T024: Manual test
    └─→ T024a: Test drag cancellation on status change

Phase 7 (Polish)
    ├─→ T026: Responsive design test
    ├─→ T027: Error handling
    ├─→ T028: Data validation
    ├─→ T029: Cross-tab sync test
    ├─→ T030: Console error check
    ├─→ T031: Contract code review
    └─→ T032: Documentation
```

---

## Parallel Execution Groups

**Group A** (Independent, can run simultaneously after Phase 2):
- T009 (GoalCard update)
- T010 (GoalColumn creation)
- Phase 3 tasks can be completed independently

**Group B** (Independent after Phase 2):
- T019 (Service validation - code review only)
- T020 (Dashboard rendering - requires Phase 3 GoalColumn first)

**Note**: Phase 3 must complete before Phase 5 because GoalDashboard integrates both columns.

---

## MVP Scope (Minimum Viable Product)

**Phases to Complete for MVP**:
1. ✅ Phase 1: Setup & Dependencies
2. ✅ Phase 2: Foundational Services
3. ✅ Phase 3: Core Drag-and-Drop (Active Goals)
4. ✅ Phase 4: Visual Feedback
5. Partial: Phase 6: Drag Prevention (checkbox/delete button safety)
6. Partial: Phase 7: Polish (error handling, validation, responsive)

**Not Required for MVP** (Phase 8+):
- Undo/redo for reordering
- Animated transitions between positions
- Advanced keyboard shortcuts
- Detailed UI notifications for load failures

---

## Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| FR-001: Active goals can be reordered | 100% | Manual drag test in npm run dev |
| FR-002: Completed goals can be reordered | 100% | Manual drag test in npm run dev |
| FR-003: Drop indicator visible | 100% | Visual inspection during drag |
| FR-004: Semi-transparent dragged item | 100% | Visual inspection during drag |
| FR-005: Cursor changes (grab/grabbing) | 100% | Visual inspection hover/drag |
| FR-006: No drag on buttons | 100% | Click buttons, verify no drag |
| FR-007: Persistence on refresh | 100% | Add/reorder, refresh, verify |
| FR-008: Cancel drag on status change | 100% | Delete goal during drag, verify abort |
| FR-009: 60fps smooth performance | 100% | Visual observation, no jank |
| FR-010: Keyboard accessibility | 100% | Code review vs contract |
| FR-011: Independent column order | 100% | Reorder each column independently |
| FR-012: Auto-scroll near edges | 100% | Drag goal near edge, verify scroll |
| FR-013: Cross-tab sync | 100% | Two tabs, change in one, verify other |

---

## Verification Instructions

### Manual Testing Checklist (via `npm run dev`)

```bash
# 1. Open app and verify basic functionality
npm run dev
# - Navigate to http://localhost:3000
# - Verify Goal Tracker Dashboard displays

# 2. Test Active Goals column drag-and-drop
# - Add 3-4 custom goals
# - Drag first goal to last position
# - Verify goal moves and order updates
# - Refresh page (Cmd+R)
# - Verify goal remains in last position (localStorage persistence)

# 3. Test Visual Feedback
# - Hover over goal → cursor should change to grab icon
# - Click and drag goal → cursor changes to grabbing, goal becomes semi-transparent
# - Drag goal over drop target → drop indicator line appears
# - Release mouse → goal appears in new position at full opacity

# 4. Test Completed Goals column (if implemented)
# - Check a goal → moves to completed column
# - Drag goal within completed column
# - Verify independent ordering from active column

# 5. Test Interactive Element Safety
# - Click checkbox → goal toggles complete, no drag initiated
# - Click delete button → confirmation modal, no drag initiated
# - Click goal title → drag operation initiates normally

# 6. Test Cross-Tab Synchronization
# - Open app in two browser tabs
# - Make changes in Tab 1 (reorder, add goal, etc.)
# - Switch to Tab 2 → changes appear automatically
# - Verify no duplicate renders or race conditions

# 7. Check for Errors
# - Open DevTools (F12)
# - Check Console tab for any red errors
# - Verify all operations complete without exceptions
```

### Code Review Checklist

- [ ] Components implement contracts from `contracts/component-service-interfaces.md`
- [ ] Services implement contracts exactly (signatures, parameters, returns)
- [ ] GoalOrderService maintains invariants (order values [0,1,2,...]no gaps)
- [ ] localStorage persistence works (test refresh page)
- [ ] Cross-tab events properly dispatched and received
- [ ] No console errors during any drag operation
- [ ] TypeScript strict mode enabled, no `any` types
- [ ] Tailwind CSS classes used for all styling (no custom CSS for MVP)
- [ ] No test files created per Constitution v1.0.0

---

## Task Summary

- **Total Tasks**: 37 (32 original + 3 auto-scroll + 1 drag cancellation test + 1 keyboard test)
- **Setup Tasks**: 3
- **Foundational Tasks**: 5
- **User Story 1 Tasks**: 5
- **User Story 3 Tasks**: 5
- **User Story 2 Tasks**: 3
- **User Story 4 Tasks**: 3
- **Keyboard Accessibility Tasks**: 2 (moved from Phase 7)
- **Auto-Scroll Tasks**: 3 (NEW Phase 4.5)
- **Drag Cancellation Test**: 1 (in Phase 6)
- **Remaining Polish Tasks**: 7

**Estimated Timeline**: 
- Phase 1: 0.5 hours
- Phase 2: 3-4 hours (services are core logic)
- Phase 3: 2-3 hours (component integration)
- Phase 4: 1 hour (mostly Tailwind styling)
- Phase 5: 1 hour (reuses Phase 3 logic)
- Phase 6: 1 hour (configuration)
- Phase 7: 2-3 hours (testing + polish)
- **Total**: 10-14 hours for full implementation

**For MVP** (Phases 1-4 + partial 6-7): **6-8 hours**

---

## References

- **Specification**: [specs/002-goal-reorder/spec.md](spec.md)
- **Implementation Plan**: [specs/002-goal-reorder/plan.md](plan.md)
- **Data Model**: [specs/002-goal-reorder/data-model.md](data-model.md)
- **Component/Service Contracts**: [specs/002-goal-reorder/contracts/component-service-interfaces.md](contracts/component-service-interfaces.md)
- **Quickstart Guide**: [specs/002-goal-reorder/quickstart.md](quickstart.md)
- **Research Phase**: [specs/002-goal-reorder/research.md](research.md)
- **Sortable.js Docs**: https://sortablejs.github.io/Sortable/
- **Tailwind CSS Docs**: https://tailwindcss.com/

---

**Version**: 1.0.0 | **Date**: 2026-02-15 | **Status**: ✅ Ready for Implementation
