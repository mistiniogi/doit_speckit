# Component & Service Contracts: Goal Reordering

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-02-15  
**Format**: TypeScript interfaces (contracts, not implementation)

## Overview

This document defines the contracts (interfaces) for components and services that implement goal reordering via drag-and-drop. Implementation follows these contracts to ensure consistency and testability via code review.

## Component Contracts

### DraggableGoalCard

**Purpose**: Renders a single goal card with drag-and-drop support

**Props Contract**:

```typescript
interface DraggableGoalCardProps {
  goal: Goal;
  isDragging?: boolean;           // Visual feedback: semi-transparent if true
  dragHandle?: HTMLElement | null; // Sortable.js handle reference
  status: 'active' | 'completed'; // Context for styling
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

// Exported component
export const DraggableGoalCard: React.FC<DraggableGoalCardProps>;
```

**Behavior**:

- Renders a `<div>` with `data-id={goal.id}` for Sortable.js identification
- When `isDragging === true`: applies `opacity-50` to indicate in-motion state
- Displays goal title, days remaining, and completion date (if completed)
- Renders two buttons: "Complete" (if active) and "Delete" (both)
- Buttons have `data-no-drag="true"` to prevent drag initiation

**CSS Classes**:

```css
/* Applied by component */
[data-dragging="true"] {
  @apply opacity-50;
}

.draggable-goal-card {
  @apply cursor-grab;
}

.draggable-goal-card:active {
  @apply cursor-grabbing;
}

.draggable-goal-card button {
  @apply cursor-pointer;
}
```

**Accessibility**:

- Buttons must have `aria-label` attributes
- Goal title must be readable by screen readers
- Days remaining should be in semantic `<time>` or `<span>` with appropriate role
- No semantic role should be grabbed/dragged

---

### GoalColumn

**Purpose**: Container for goals within a single column with Sortable.js integration

**Props Contract**:

```typescript
interface GoalColumnProps {
  title: string;                          // Column header (e.g., "Active Goals")
  goals: Goal[];                          // Goals to display in this column
  status: 'active' | 'completed';        // Status filter for goals
  displayEmptyMessage: string;            // Message when no goals (from spec)
  onReorder: (reorderedGoals: Goal[]) => void;  // Called after drag completes
  onComplete?: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

// Exported component
export const GoalColumn: React.FC<GoalColumnProps>;
```

**Behavior**:

- Initializes Sortable.js instance on mount for this column's goal list
- Sortable options:
  ```typescript
  {
    handle: '.drag-handle',           // Only drag from handle
    group: false,                      // No cross-column dragging
    ghostClass: 'sortable-ghost',     // Class applied to dragged item
    onEnd: handleSortEnd,             // Callback when drag completes
    forceFallback: true,              // Enable for touch devices
    scroll: true,
    scrollSensitivity: 30,            // Auto-scroll trigger distance
  }
  ```
- Renders list of `<DraggableGoalCard>` components
- Shows empty state message when goals.length === 0
- Maintains independent ordering from other column

**Visual Structure**:

```html
<div class="goal-column" data-status="active">
  <h2 class="column-title">Active Goals</h2>
  
  <ul class="sortable-list" data-status="active">
    <li data-id="goal-1">
      <DraggableGoalCard goal={goals[0]} status="active" ... />
    </li>
    <li data-id="goal-2">
      <DraggableGoalCard goal={goals[1]} status="active" ... />
    </li>
    <!-- Drop indicator renders here when dragging -->
    <li class="drop-indicator" style="border-top: 2px solid blue;"></li>
  </ul>
  
  <div class="empty-state">Your completed goals will appear here.</div>
</div>
```

**Sortable.js Integration**:

```typescript
// In useEffect
const sortableInstance = Sortable.create(containerElement, {
  handle: '.drag-handle',
  ghostClass: 'opacity-50',
  onEnd: (evt: Sortable.SortableEvent) => {
    const newGoals = calculateNewOrder(goals, evt.oldIndex, evt.newIndex);
    onReorder(newGoals);
  }
});

// Cleanup on unmount
return () => sortableInstance.destroy();
```

---

### GoalDashboard

**Purpose**: Main container managing both columns with drag-and-drop coordination

**Props Contract**:

```typescript
interface GoalDashboardProps {
  initialGoals?: Goal[];
}

// Exported component
export const GoalDashboard: React.FC<GoalDashboardProps>;
```

**Behavior**:

- Loads goals from localStorage on mount (or initialGoals prop)
- Renders two `<GoalColumn>` components side-by-side (responsive)
- Manages shared state for all goals
- Coordinates reordering between columns
- Handles goal completion/deletion across both columns
- Syncs localStorage and dispatches storage events for cross-tab sync

**State Management**:

```typescript
const [goals, setGoals] = useState<Goal[]>([]);

const activeGoals = goals.filter(g => g.status === 'active').sort((a, b) => a.order - b.order);
const completedGoals = goals.filter(g => g.status === 'completed').sort((a, b) => a.order - b.order);

const handleReorder = (reorderedGoals: Goal[]) => {
  setGoals(reorderedGoals);
  saveToLocalStorage(reorderedGoals);
};
```

---

## Service Contracts

### GoalOrderService

**Purpose**: Business logic for managing goal ordering operations

**Exported Functions**:

```typescript
namespace GoalOrderService {
  /**
   * Reorder goals within a single column after drag-and-drop
   * @param goals - Current goals array
   * @param goalId - ID of the goal being moved
   * @param newIndex - New position (0-based) within its status group
   * @param status - Status group the goal belongs to
   * @returns Updated goals array with new order values
   */
  export function reorderGoalsInColumn(
    goals: Goal[],
    goalId: string,
    newIndex: number,
    status: 'active' | 'completed'
  ): Goal[];

  /**
   * Get goals sorted by order within a status group
   * @param goals - Goals array
   * @param status - Status filter
   * @returns Goals filtered and sorted by order ascending
   */
  export function getGoalsInStatus(
    goals: Goal[],
    status: 'active' | 'completed'
  ): Goal[];

  /**
   * Validate that goal orders are contiguous (no gaps)
   * @param goals - Goals array
   * @param status - Status group to validate
   * @returns true if valid, false if gaps exist
   */
  export function validateGoalOrder(
    goals: Goal[],
    status: 'active' | 'completed'
  ): boolean;

  /**
   * Repair goal order values (used during migration or corruption recovery)
   * @param goals - Goals array potentially with invalid order
   * @returns Goals with repaired order values [0, 1, 2, ...]
   */
  export function repairGoalOrder(goals: Goal[]): Goal[];

  /**
   * Calculate new goal when marked complete
   * @param goals - Current goals
   * @param goalId - ID of goal being completed
   * @returns Updated goals array with moved goal
   */
  export function completeGoal(goals: Goal[], goalId: string): Goal[];

  /**
   * Remove goal and repair ordering
   * @param goals - Current goals
   * @param goalId - ID of goal to delete
   * @returns Updated goals without the deleted goal
   */
  export function deleteGoal(goals: Goal[], goalId: string): Goal[];
}
```

**Error Handling**:

```typescript
// Throws Error if:
// - goalId not found in goals array
// - newIndex out of bounds for status group
// - status is invalid
// - Validation fails (invariants violated)

// Example:
try {
  const updated = GoalOrderService.reorderGoalsInColumn(goals, 'goal-123', 5, 'active');
} catch (err) {
  console.error('Reordering failed:', err.message);
  // Handle gracefully - notify user, but don't lose data
}
```

---

### GoalStorageService

**Purpose**: Persistence layer for goals and order state

**Exported Functions**:

```typescript
namespace GoalStorageService {
  /**
   * Load all goals from localStorage
   * @returns All goals (auto-migrates if order property missing)
   */
  export function loadGoals(): Goal[];

  /**
   * Save goals to localStorage and notify other tabs
   * @param goals - Goals to persist
   */
  export function saveGoals(goals: Goal[]): void;

  /**
   * Subscribe to localStorage changes from other tabs
   * @param callback - Called when storage changes detected
   * @returns Unsubscribe function
   */
  export function onStorageChange(
    callback: (goals: Goal[]) => void
  ): () => void;

  /**
   * Clear all goals from localStorage (destructive)
   */
  export function clearGoals(): void;

  /**
   * Validate stored goals have proper order structure
   * @returns true if valid, false if corruption detected
   */
  export function validateStorageIntegrity(): boolean;
}
```

**Storage Events** (for cross-tab sync):

```typescript
// When saveGoals() is called:
// 1. It saves to localStorage under key "doit_goals"
// 2. It dispatches custom event 'doit_goals_updated' with detail
// 3. Other tabs listen for storage event and reload if needed

window.addEventListener('storage', (evt) => {
  if (evt.key === 'doit_goals' && evt.newValue) {
    const goals = JSON.parse(evt.newValue);
    onStorageChange(goals);
  }
});
```

---

### GoalReorderValidator

**Purpose**: Validate reordering operations maintain data integrity

**Exported Functions**:

```typescript
namespace GoalReorderValidator {
  /**
   * Validate a reordering operation before committing
   * @param currentGoals - Current state
   * @param goalId - Goal being moved
   * @param newIndex - Proposed new position
   * @param status - Status group
   * @returns { valid: boolean, error?: string }
   */
  export function validateReordering(
    currentGoals: Goal[],
    goalId: string,
    newIndex: number,
    status: 'active' | 'completed'
  ): { valid: boolean; error?: string };

  /**
   * Check all invariants are maintained
   * @param goals - Goals to validate
   * @returns { valid: boolean, violations: string[] }
   */
  export function checkInvariants(goals: Goal[]): {
    valid: boolean;
    violations: string[];
  };
}
```

**Validation Rules** (per data-model.md):

1. All goals in active group have order [0, 1, 2, ..., n] with no gaps
2. All goals in completed group have order [0, 1, 2, ..., m] with no gaps
3. No two goals with same status have same order value
4. order property >= 0
5. activeGoals.length matches filtered count
6. completedGoals.length matches filtered count

---

## Hook Contracts

### useSortableGoals

**Purpose**: React hook for managing sortable goals list

**Interface**:

```typescript
interface UseSortableGoalsOptions {
  status: 'active' | 'completed';
  onReorder?: (goals: Goal[]) => void;
}

interface UseSortableGoalsReturn {
  sortableRef: React.MutableRefObject<HTMLUListElement | null>;
  draggedGoalId: string | null;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export function useSortableGoals(
  goals: Goal[],
  options: UseSortableGoalsOptions
): UseSortableGoalsReturn;
```

**Behavior**:

- Initializes Sortable.js on the provided ref
- Manages isDragging state for visual feedback
- Calls onReorder callback when sorting completes
- Cleans up Sortable instance on unmount
- Auto-scrolls column when dragging near edges

---

### useGoalCrossSyncStorage

**Purpose**: React hook for cross-tab synchronization

**Interface**:

```typescript
interface UseGoalCrossSyncStorageOptions {
  onGoalsChange?: (goals: Goal[]) => void;
}

export function useGoalCrossSyncStorage(
  options?: UseGoalCrossSyncStorageOptions
): void;
```

**Behavior**:

- Listens for storage events on 'doit_goals' key
- When storage changes detected in other tabs, calls onGoalsChange callback
- Ignores changes from same tab (source tracking)
- Cleans up event listeners on unmount

---

## Error Handling Strategy

All components and services MUST handle errors gracefully without data loss:

```typescript
// Pattern: Try operation, fallback, notify user
async function handleReorder(reorderedGoals: Goal[]) {
  try {
    GoalOrderService.validateReordering(...);
    setGoals(reorderedGoals);
    GoalStorageService.saveGoals(reorderedGoals);
  } catch (err) {
    console.error('Reorder failed:', err);
    // Reload from localStorage to restore last known good state
    const lastGood = GoalStorageService.loadGoals();
    setGoals(lastGood);
    // Show user-facing error (not yet spec'd, but essential)
  }
}
```

## Summary

These contracts establish clear boundaries between components and services, enabling:
- **Code review**: Reviewers can validate against these interfaces
- **Consistency**: All implementations follow the same patterns
- **Testability** (via code review): Logic is isolated in services
- **Maintainability**: Changes to implementation don't require coordinating multiple components

All implementations MUST satisfy these contracts exactly.
