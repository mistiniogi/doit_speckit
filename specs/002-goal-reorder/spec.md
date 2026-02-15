# Feature Specification: Goal Reordering via Drag-and-Drop

**Feature Branch**: `002-goal-reorder`  
**Created**: 2026-02-15  
**Status**: Draft  
**Input**: User description: "Users should be able to reorder the goals by dragging and dropping them above or below in the list."

## User Scenarios *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY VERIFIABLE via direct visual inspection and code review.
  NOTE: Per Constitution, NO automated testing (unit/integration/e2e) is permitted.
  Verification happens through: npm run dev visual testing + code review.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Visually verified independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Drag Goal Within Active Goals Column (Priority: P1)

As a user, I want to drag and drop goals in the active goals column to arrange them in the order that makes sense for my own priority system.

The user can click and hold on a goal card, drag it above or below other goals in the left (active goals) column, and release to drop it in a new position. The icon or visual indicator appears on the goal card to show it's draggable. During dragging, a visual indicator (ghost image, shadow, or highlight) shows where the goal will be placed when dropped. After dropping, the goal remains in its new position and the list updates to reflect the new order.

**Why this priority**: Prioritizing goals by personal preference is core to the goal-tracking user experience. Users need to organize their active goals in a custom order that aligns with their priorities, not the default order.

**Manual Verification**: User sees goals in the active column → clicks and holds a goal card → drags it to a new position → sees a visual preview of where it will land → releases to drop → goal moves to new position and list reflects the change.

**Acceptance Scenarios**:

1. **Given** multiple goals exist in the active column, **When** the user drags a goal from position 1 to position 3, **Then** the goal moves to position 3 and other goals shift up accordingly
2. **Given** a goal is being dragged, **When** the user moves the cursor above or below a target goal, **Then** a visual drop indicator appears showing where the goal will be placed
3. **Given** a user drags a goal but changes their mind, **When** the user releases the mouse pointer outside the column or on the same position, **Then** the goal returns to its original position
4. **Given** a goal is dropped in a new position, **When** the page is refreshed, **Then** the goal remains in its new position (persistence)

---

### User Story 2 - Drag Goal Within Completed Goals Column (Priority: P2)

As a user, I want to reorder my completed goals by dragging them in the completed column so I can organize them by completion date, difficulty, or any other personal preference.

Similar to active goals, the user can drag and drop goal cards within the right (completed goals) column. The visual feedback and interaction patterns match those in the active goals column.

**Why this priority**: While less critical than reordering active goals (which affect daily prioritization), users may want to reorganize completed goals for reflection or record-keeping purposes.

**Manual Verification**: User sees completed goals in the right column → drags a goal to a new position within the same column → sees drop indicator → releases → goal moves to new position.

**Acceptance Scenarios**:

1. **Given** multiple completed goals exist, **When** the user drags a goal to a new position within the completed column, **Then** the goal moves to the new position
2. **Given** a goal is dropped, **When** the page is refreshed, **Then** the completed goal remains in its new position

---

### User Story 3 - Visual Feedback During Drag Operation (Priority: P1)

As a user, I want clear visual feedback while dragging so I understand exactly what will happen when I release the goal.

The dragged goal displays a semi-transparent or ghosted appearance while being dragged, indicating it's in motion. A drop indicator (horizontal line, highlighted insertion point, or highlight region) shows precisely where the goal will land. The cursor changes to indicate the item is draggable (e.g., grab cursor) and moves to `grabbing` during drag.

**Why this priority**: User confidence in the interaction depends on clear feedback. Without visual cues, users will feel uncertain about the drag operation and may accidentally drop goals in unintended positions.

**Manual Verification**: User hovers over a goal and sees the cursor change to a grab icon → clicks and drags → sees the dragged item semi-transparent and a drop indicator line/highlight appears below a neighboring goal → releasing at that position drops the goal precisely at the indicator location.

**Acceptance Scenarios**:

1. **Given** a user hovers over a goal card, **When** the cursor is positioned on the goal, **Then** the cursor changes to a "grab" style (or similar visual indicating draggability)
2. **Given** a user begins dragging a goal, **When** the goal is being moved, **Then** the dragged goal appears ghosted/semi-transparent and a drop indicator line/region is visible
3. **Given** a user moves the cursor while dragging, **When** the cursor moves over a drop target, **Then** the drop indicator updates to show the new drop position
4. **Given** a user drops a goal, **When** the drop completes, **Then** the dragged goal returns to full opacity and appears in its new position

---

### User Story 4 - Prevent Accidental Drag (Priority: P2)

As a user, I want to prevent accidentally triggering drag operations when I'm trying to interact with goal elements like checkboxes or delete buttons.

When a user clicks and holds directly on interactive elements (checkbox, delete button), the drag operation does not initiate. The drag operation only starts when the user clicks and holds on the drag handle or neutral area of the goal card.

**Why this priority**: Users might mistakenly drag when trying to check off or delete a goal. This prevents frustration and ensures precise interactions with controls.

**Manual Verification**: User clicks on the checkbox of a goal and holds → no drag operation initiates, only the checkbox state changes. User clicks on the drag handle area and holds → drag operation initiates normally.

**Acceptance Scenarios**:

1. **Given** a user clicks on the checkbox of a goal, **When** they hold the mouse down, **Then** drag is not initiated; only the checkbox is interacted with
2. **Given** a user clicks on the delete button, **When** they hold, **Then** drag is not initiated; the delete confirmation modal appears
3. **Given** a user clicks on the goal title or neutral area and holds, **When** they drag, **Then** the drag operation is initiated normally

### Edge Cases

- What happens when dragging a goal and the list scrolls beyond the viewport? → The dragged goal should remain visible in the viewport; consider auto-scroll behavior if dragging near the edges
- How does the system handle dragging with many goals (50+)? → Drag performance should remain smooth; consider virtual scrolling or performance optimization
- What happens if a user drags a goal while another user (in different browser/tab) modifies the same goal? → Goal reordering syncs across browser tabs when the same user opens the app in multiple tabs; changes in one tab appear in other tabs automatically
- What happens when a user completes (checks off) a goal while dragging might be in progress? → Dragging should be cancellable; any in-progress drag operation should be cancelled if the goal changes status
- Can a user drag a goal from active column to completed column (or vice versa)? → No; reordering is limited to within-column only. Users must use the checkbox to mark complete or delete button to remove goals; drag-and-drop is strictly for prioritization within each column

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support drag-and-drop interaction for goal cards within the active goals column, allowing users to reorder goals by dragging them above or below other goals
- **FR-002**: System MUST support drag-and-drop interaction for goal cards within the completed goals column with the same behavior as active goals
- **FR-003**: System MUST display a visual drop indicator (horizontal line, highlighted insertion point, or similar) during drag operations to show where the goal will be placed when dropped
- **FR-004**: System MUST apply semi-transparent or ghosted styling to a goal card that is currently being dragged to visually distinguish it from stationary goals. **Specification**: Dragged goal opacity must be **50%** (CSS: `opacity: 0.5`; Tailwind: `.opacity-50`)
- **FR-005**: System MUST change the cursor style to "grab" when hovering over a draggable goal area and to "grabbing" during an active drag operation. **Specification**: CSS cursor values are `cursor: grab` (hover state) and `cursor: grabbing` (during drag). Tailwind CSS classes: `.cursor-grab` (hover) and `.cursor-grabbing` (drag state)
- **FR-006**: System MUST prevent drag initiation when the user clicks and holds on interactive elements (checkboxes, delete buttons); drag MUST only initiate when the user clicks neutral areas or a dedicated drag handle
- **FR-007**: System MUST persist the new goal order to browser storage immediately upon drop completion so the reordered list survives page refresh
- **FR-008**: System MUST cancel any in-progress drag operation if the goal's status changes (e.g., when a goal is completed/deleted during dragging)
- **FR-009**: System MUST maintain smooth drag performance even with a large number of goals (50+); no perceptible lag or jank during drag operations
- **FR-010**: System MUST support keyboard accessibility for drag-and-drop operations using standard patterns (e.g., focus on goal, press Space/Enter to enter drag mode, arrow keys to move, Enter to confirm, Escape to cancel)
- **FR-011**: System MUST respect the reordering preference within each column independently—reordering active goals does not affect completed goals order and vice versa
- **FR-012**: When a user drags a goal near the edge of a scrollable goals column, the system MUST auto-scroll the column to allow the user to drop the goal in areas that may be off-screen
- **FR-013**: System MUST sync goal order across multiple browser tabs when the same user has the app open in multiple tabs. When goal order changes in one tab, localStorage is updated and all other tabs receive a notification and update their display with the new order

### Key Entities

- **Goal**: Same as defined in 001-goal-tracker, plus a new property:
  - `order`: A numeric value (integer) representing the goal's position within its column (active or completed). Goals are sorted by this value in ascending order. Default order is assigned as goals are added (auto-increment) or when status changes.

- **GoalList**: Container for all goals (same as 001-goal-tracker), with the addition that goals are now sorted by the `order` property within each status group (active, completed).

## Clarifications *(user decisions)*

### Session 2026-02-15

- Q1: Can users drag goals between columns (active ↔ completed)? → A: No, reordering is within-column only. Drag-and-drop is strictly for prioritization within active or completed columns. Status changes happen via checkbox or delete button.
- Q2: Should goal reordering sync across browser tabs? → B: Yes, sync across tabs. When the same user opens the app in multiple tabs and reorders goals in one tab, all other tabs automatically update to show the new order via localStorage events.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can drag and drop a goal to reorder within the active goals column and complete the action in under 5 seconds
- **SC-002**: Visual drop indicator appears within 200ms of user initiating drag and updates position with each cursor movement (no lag)
- **SC-003**: 100% of drag-and-drop operations result in goals appearing in the exact position indicated by the drop indicator
- **SC-004**: Reordered goal positions persist after page refresh (zero data loss on refresh)
- **SC-005**: Drag operations are smooth and responsive with no visible jank or performance degradation when dragging (60fps or equivalent smooth motion)
- **SC-006**: Users cannot accidentally drag a goal when clicking interactive elements (checkbox, delete button); attempts to interact with these elements work as intended
- **SC-007**: The drag-and-drop feature works across all tested viewport sizes (mobile 375px, tablet 768px, desktop 1024px+)
- **SC-008**: Keyboard accessibility (focus, Space/Enter, arrow keys) allows keyboard-only users to reorder goals without using mouse/touch

## Assumptions

- Users have browsers supporting modern drag-and-drop APIs or equivalent touch-drag interactions
- Goal order is stored locally in browser storage and does not require backend sync for MVP
- Drag-and-drop reordering is scoped to within-column reordering only (active goals in active column only; completed goals in completed column only)
- Goal order syncs across multiple browser tabs of the same user via localStorage events; no backend sync required for cross-tab communication
- Each status (active, completed) maintains its own independent ordering; no cross-column dragging in MVP
- Visual feedback patterns follow modern web app conventions (semi-transparency for dragged items, insertion indicators, cursor changes)
- Touch gesture support (e.g., on mobile) uses platform-appropriate patterns (e.g., long-press to initiate drag)

## Out of Scope

- Reordering goals across columns (active to completed or vice versa) via drag
- Real-time multi-user synchronization of goal order across devices or browser sessions
- Undo/redo for reordering actions
- Animated transitions for goals moving to new positions (smooth transitions acceptable but not required)
- Custom drag handle element if cursor change and neutral-area detection suffices
- Backend persistence of goal order (client-side storage only)
