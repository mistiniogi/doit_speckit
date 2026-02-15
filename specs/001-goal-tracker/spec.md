# Feature Specification: Goal Tracker Dashboard

**Feature Branch**: `001-goal-tracker`  
**Created**: 2026-02-14  
**Status**: Draft  
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be checked using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Let's use a modern light theme with fun pastel colours."

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

### User Story 1 - View Goals Dashboard (Priority: P1)

As a user, I want to see my current and completed goals organized in a two-column layout so that I can quickly understand what I need to work on and what I've already accomplished.

The left column displays current (active) goals with each goal showing:
- Goal title
- Days remaining until the end date
- Checkbox to mark the goal as complete
- Visual highlighting if goal is within 3 days of headline
- Delete button to permanently remove the goal

The right column displays completed goals with:
- Goal title  
- Completed date (when it was marked done)
- Delete button to remove from completed list
- Goals are sorted by completion date, newest (most recently completed) first

The interface uses a modern light theme with fun pastel colors that create a welcoming, motivating atmosphere.

**Why this priority**: This is the foundation of the app. Users must be able to see their goals before they can interact with them. No other features provide value without this core view.

**Manual Verification**: User opens the app → immediately sees a clean two-column dashboard with current goals on left and completed goals on right. Goals within 3 days of deadline should have distinct visual styling. Layout should be responsive and readable on mobile, tablet, and desktop.

**Acceptance Scenarios**:

1. **Given** a user opens the app with no goals, **When** the page loads, **Then** the left column displays "No goals yet. Click 'Add Goal' to get started!" and the right column displays "Your completed goals will appear here."
2. **Given** a user has goals with various end dates, **When** viewing the dashboard, **Then** days remaining is calculated and displayed correctly (e.g., "5 days left")
3. **Given** a goal's end date is within 3 days, **When** viewing the dashboard, **Then** the goal is visually highlighted to indicate urgency
4. **Given** the viewport is a mobile screen, **When** viewing the dashboard, **Then** the layout remains readable and controls are easily tappable

---

### User Story 2 - Add New Goal (Priority: P1)

As a user, I want to quickly add new goals by clicking a button that opens a modal form, so that I can expand my list of things to accomplish.

Clicking the "Add Goal" button displays a modal containing:
- Title input field (required, text)
- End Date input field (required, date picker)
- "Create Goal" button to submit
- "Cancel" button to dismiss without saving
- Proper form validation with error messages for missing fields

After submitting the form, the modal closes and the new goal appears in the left column with correct days-remaining calculation.

**Why this priority**: Users must be able to add goals for the app to be useful. This is equally critical as viewing goals.

**Manual Verification**: User clicks "Add Goal" button → modal appears with clean form. User enters valid title and end date → submits → modal closes and new goal appears in left column with correct days remaining displayed. If user submits with missing fields, validation errors appear.

**Acceptance Scenarios**:

1. **Given** a user clicks the "Add Goal" button, **When** the modal opens, **Then** focus is on the title field and form is ready for input
2. **Given** a user enters a title and end date, **When** clicking "Create Goal", **Then** the goal is added to the current goals list with correct days-remaining calculation
3. **Given** a user submits the form with an empty title, **When** validation runs, **Then** an error message appears and the form is not submitted
4. **Given** a user clicks "Cancel", **When** the modal closes, **Then** no goal is added and the form is reset

---

### User Story 3 - Manage Goal Status (Priority: P2)

As a user, I want to check off goals when I complete them and move them to the completed column, or permanently delete goals I no longer want to track.

Checking the checkbox next to a goal or clicking the "complete" action:
- Moves the goal from the left column to the right column
- Records the completion date
- Removes the goal from the active goals view

Clicking the delete button on any goal:
- Permanently removes the goal from the list
- Shows a modal confirmation dialog with the message "Delete this goal?" and Cancel/Confirm buttons
- Updates the display immediately after confirmation
- Dismisses the modal if user clicks Cancel

**Why this priority**: Users need to manage their goals as they progress. This demonstrates the app's core value of tracking progress and provides motivation through visual accomplishment.

**Manual Verification**: User checks the checkbox on a goal → goal moves to completed column. User clicks delete on a goal → goal is removed. If confirmation is used, user can cancel the deletion and the goal remains.

**Acceptance Scenarios**:

1. **Given** a goal is in the current column, **When** the user checks its checkbox, **Then** the goal moves to the completed column with today's date shown
2. **Given** a goal is in the completed column, **When** the user clicks the delete button, **Then** the goal is permanently removed with visual feedback
3. **Given** a goal is in the left column, **When** the user clicks the delete button, **Then** a confirmation dialog appears asking "Delete this goal?" with cancel/confirm options
4. **Given** the user confirms a deletion, **When** the action completes, **Then** the goal is removed and the layout updates smoothly

### Edge Cases

- What happens when a goal's end date is today? → Display "0 days left" and apply urgent highlighting
- How does the system handle goals with past end dates? → Still appear in current goals column with urgent styling; user should delete or complete them
- What happens when a user has 50+ goals? → Layout should remain usable; consider scrolling behavior for columns
- How does the app handle very long goal titles? → Text should wrap gracefully without breaking the layout
- What happens on midnight when a goal's days-remaining changes? → Days calculation updates on page refresh; consider live updates if feasible (bonus)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST display current (active) goals in the left column with clear visual separation from completed goals. When no active goals exist, the left column MUST display the empty state message: "No goals yet. Click 'Add Goal' to get started!"
- **FR-002**: System MUST calculate and display days remaining for each goal based on the end date (e.g., "5 days left")
- **FR-003**: System MUST display completed goals in the right column, separate from active goals, sorted by completion date with newest (most recently completed) goals appearing first. When no completed goals exist, the right column MUST display the empty state message: "Your completed goals will appear here."
- **FR-004**: System MUST apply visual highlighting (color, badge, or styling change) to any goal within 3 days of its end date to indicate urgency
- **FR-005**: Users MUST be able to click an "Add Goal" button that opens a modal form with title and end date fields
- **FR-006**: System MUST validate the Add Goal form and prevent submission if title or end date is missing
- **FR-007**: System MUST add new goals immediately to the current goals list with correct days-remaining calculation after successful form submission
- **FR-008**: Users MUST be able to check a checkbox on a goal to mark it complete, moving it to the completed column
- **FR-009**: System MUST record the completion date when a goal is marked complete (today's date)
- **FR-010**: Users MUST be able to permanently delete goals using a delete button. Deletion MUST trigger a modal confirmation dialog with the message "Delete this goal?" with Cancel and Confirm buttons. The goal is only deleted after user confirms in the modal.
- **FR-011**: System MUST apply a modern light theme with fun pastel color scheme using Light Pastels palette (#FFE0EC pink, #E0F4FF blue, #E0FFE0 green, #F0E0FF purple) to all interface elements
- **FR-012**: Interface MUST be responsive and usable across mobile (375px), tablet (768px), and desktop (1024px+) viewports
- **FR-013**: Interface MUST meet WCAG 2.1 Level A accessibility standards including keyboard navigation, color contrast ratios, and semantic HTML
- **FR-014**: System MUST persist goals in browser storage (localStorage or equivalent) so they remain after page refresh

### Key Entities

- **Goal**: Represents a user's objective
  - `id`: Unique identifier (UUID)
  - `title`: Goal name/description (required, string, max 255 characters)
  - `endDate`: Target completion date (required, ISO date format)
  - `status`: Current state (enum: "active", "completed")
  - `completedDate`: When goal was marked complete (ISO date, null if not completed)
  - `createdDate`: When goal was created (ISO date timestamp)

- **GoalList**: Container for all goals
  - `goals`: Array of Goal objects
  - `activeGoals`: Filtered view of goals with status === "active"
  - `completedGoals`: Filtered view of goals with status === "completed"

## Clarifications

### Session 2026-02-15

- Q: What pastel color palette should the "fun pastel colours" theme use? → A: Light Pastels - soft, desaturated colors: #FFE0EC (pink), #E0F4FF (blue), #E0FFE0 (green), #F0E0FF (purple)
- Q: What accessibility standard (WCAG level) should the interface meet? → A: WCAG 2.1 Level A - basic accessibility with keyboard support and minimum color contrast
- Q: What UI pattern should the delete confirmation use? → A: Modal Dialog - full-screen overlay with "Are you sure?" message and Cancel/Confirm buttons
- Q: How should completed goals be ordered in the right column? → A: Newest First - most recently completed goals appear at the top
- Q: What empty state messages should appear when there are no goals? → A: Current Goals: "No goals yet. Click 'Add Goal' to get started!" and Completed Goals: "Your completed goals will appear here."

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can navigate to the app and see the two-column dashboard layout fully rendered within 2 seconds on broadband connection
- **SC-002**: A new goal can be added from empty list to dashboard with title and end date in under 30 seconds of user interaction
- **SC-003**: Goals within 3 days of deadline are visually distinct and clearly identifiable (100% of such goals receive urgent styling)
- **SC-004**: The app layout remains properly formatted and usable across all tested viewport sizes (mobile 375px, tablet 768px, desktop 1024px+)
- **SC-005**: Goals persist after page refresh - no data loss during browser navigation
- **SC-006**: Users can complete a goal with a single checkbox click action
- **SC-007**: Responsive design uses Tailwind CSS utilities - no custom media queries or breakpoint-specific styling inconsistencies
- **SC-008**: Code review confirms adherence to Clean Code principles: meaningful variable names, single-responsibility components, proper TypeScript typing

## Assumptions

- Users have a modern web browser with localStorage support
- Initial MVP focuses on client-side storage only; backend/cloud sync is out of scope
- "Modern light theme with fun pastel colors" means using soft, desaturated color palette (not neon); exact colors to be finalized during design
- Goals are per-user and single-user; no multi-user collaboration in this MVP
- No user authentication required for MVP (all goals stored locally in browser)
- Days remaining calculation is based on end date only; time of day is not considered (all dates treated as EOD)

## Out of Scope

- User authentication or multi-user support
- Cloud synchronization or backend storage
- Goal categories, tags, or custom fields
- Recurring goals
- Goal sharing or collaboration
- Push notifications for upcoming deadlines
- Mobile app (web-responsive only)
