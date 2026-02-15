# Quickstart: Goal Reordering Implementation

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-02-15  
**Target Audience**: Developers implementing the drag-and-drop feature

## Overview

This guide provides step-by-step instructions for implementing goal reordering via drag-and-drop using Sortable.js and Tailwind CSS. Follow this sequence to ensure all components integrate correctly.

## Prerequisites

**Required Knowledge**:
- React hooks (useState, useEffect, useRef, useCallback)
- TypeScript interfaces and generic types
- Tailwind CSS utility classes
- localStorage API and JSON serialization

**Tools**:
- VS Code or equivalent editor
- `npm run dev` for local testing (no test runners needed per Constitution)
- Browser DevTools for visual debugging

**Locked Dependencies** (already in package.json):
- Next.js 16.1.6
- React 19.2.3
- Tailwind CSS v4
- TypeScript ^5

## Installation

### 1. Install Sortable.js

```bash
npm install sortable --save
npm install --save-dev @types/sortable  # Type definitions
```

Then update Constitution v1.0.0 to v1.1.0 to document this addition (see plan.md).

### 2. Project Structure

Ensure the following directory structure exists (created by feature scaffolding):

```
app/
├── components/
│   ├── goal-card.tsx                 # Existing card component
│   ├── goal-column.tsx               # NEW: Sortable column container
│   ├── goal-dashboard.tsx            # Existing dashboard
│   └── [other components...]
├── lib/
│   ├── models/
│   │   └── goal.ts                   # Goal interface (extend with order property)
│   └── services/
│       ├── goal-service.ts           # Existing goal service
│       ├── goal-order-service.ts     # NEW: Ordering logic
│       ├── goal-storage-service.ts   # NEW: Persistence & sync
│       └── [other services...]
├── hooks/
│   ├── use-goals.ts                  # Existing hook
│   ├── use-sortable-goals.ts         # NEW: Sortable integration
│   └── use-goal-cross-sync-storage.ts # NEW: Cross-tab sync
└── page.tsx
```

## Implementation Sequence

### Step 1: Extend Goal Model

**File**: `app/lib/models/goal.ts`

Update the Goal interface to include the `order` property:

```typescript
export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: 'active' | 'completed';
  completedDate: string | null;
  createdDate: string;
  order: number; // NEW: Position within column
}

// Helper to create default order for new goals
export function createGoal(
  title: string,
  endDate: string,
  maxOrderInStatus: number
): Goal {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    endDate,
    status: 'active',
    completedDate: null,
    createdDate: new Date().toISOString(),
    order: maxOrderInStatus + 1
  };
}
```

### Step 2: Create GoalOrderService

**File**: `app/lib/services/goal-order-service.ts`

Implement ordering logic per contracts/component-service-interfaces.md:

```typescript
import { Goal } from '@/lib/models/goal';

export namespace GoalOrderService {
  export function reorderGoalsInColumn(
    goals: Goal[],
    goalId: string,
    newIndex: number,
    status: 'active' | 'completed'
  ): Goal[] {
    // Get all goals in the status group, sorted by order
    const goalsInStatus = goals
      .filter(g => g.status === status)
      .sort((a, b) => a.order - b.order);

    // Find the goal being moved
    const currentIndex = goalsInStatus.findIndex(g => g.id === goalId);
    if (currentIndex === -1) {
      throw new Error(`Goal ${goalId} not found in ${status} column`);
    }

    // Remove from current position and insert at new position
    const reordered = [...goalsInStatus];
    const [movedGoal] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, movedGoal);

    // Reassign order values [0, 1, 2, ...]
    const withNewOrder = reordered.map((g, idx) => ({
      ...g,
      order: idx
    }));

    // Merge back with other status group (unchanged)
    const otherStatus = status === 'active' ? 'completed' : 'active';
    const unchanged = goals.filter(g => g.status === otherStatus);

    return [...withNewOrder, ...unchanged];
  }

  export function getGoalsInStatus(
    goals: Goal[],
    status: 'active' | 'completed'
  ): Goal[] {
    return goals
      .filter(g => g.status === status)
      .sort((a, b) => a.order - b.order);
  }

  export function completeGoal(goals: Goal[], goalId: string): Goal[] {
    const completedGoals = goals
      .filter(g => g.status === 'completed')
      .sort((a, b) => a.order - b.order);

    const maxOrder =
      completedGoals.length > 0
        ? Math.max(...completedGoals.map(g => g.order))
        : -1;

    return goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          status: 'completed' as const,
          completedDate: new Date().toISOString(),
          order: maxOrder + 1
        };
      }
      return g;
    });
  }

  export function deleteGoal(goals: Goal[], goalId: string): Goal[] {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (!goalToDelete) {
      throw new Error(`Goal ${goalId} not found`);
    }

    const status = goalToDelete.status;
    const remaining = goals.filter(g => g.id !== goalId);

    // Repair order for remaining goals in same status
    const goalsInStatus = remaining
      .filter(g => g.status === status)
      .sort((a, b) => a.order - b.order);

    const reordered = goalsInStatus.map((g, idx) => ({
      ...g,
      order: idx
    }));

    const unchanged = remaining.filter(g => g.status !== status);
    return [...reordered, ...unchanged];
  }

  export function validateGoalOrder(
    goals: Goal[],
    status: 'active' | 'completed'
  ): boolean {
    const goalsInStatus = goals
      .filter(g => g.status === status)
      .sort((a, b) => a.order - b.order);

    // Check if order is contiguous [0, 1, 2, ...]
    return goalsInStatus.every((g, idx) => g.order === idx);
  }

  export function repairGoalOrder(goals: Goal[]): Goal[] {
    const activeGoals = goals
      .filter(g => g.status === 'active')
      .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());

    const completedGoals = goals
      .filter(g => g.status === 'completed')
      .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());

    const repaired = [
      ...activeGoals.map((g, idx) => ({ ...g, order: idx })),
      ...completedGoals.map((g, idx) => ({ ...g, order: idx }))
    ];

    return repaired;
  }
}
```

### Step 3: Create GoalStorageService

**File**: `app/lib/services/goal-storage-service.ts`

Implement persistence with cross-tab sync:

```typescript
import { Goal } from '@/lib/models/goal';
import { GoalOrderService } from './goal-order-service';

const STORAGE_KEY = 'doit_goals';

export namespace GoalStorageService {
  export function loadGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const goals = JSON.parse(stored) as Goal[];

      // Migration: add order property if missing
      const needsMigration = goals.some(g => g.order === undefined);
      if (needsMigration) {
        return GoalOrderService.repairGoalOrder(goals);
      }

      return goals;
    } catch (err) {
      console.error('Failed to load goals from localStorage:', err);
      return [];
    }
  }

  export function saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      // Dispatch event for other tabs
      window.dispatchEvent(
        new CustomEvent('doit_goals_updated', { detail: { goals } })
      );
    } catch (err) {
      console.error('Failed to save goals to localStorage:', err);
    }
  }

  export function onStorageChange(
    callback: (goals: Goal[]) => void
  ): () => void {
    const handleStorageChange = (evt: StorageEvent) => {
      if (evt.key === STORAGE_KEY && evt.newValue) {
        try {
          const goals = JSON.parse(evt.newValue) as Goal[];
          callback(goals);
        } catch (err) {
          console.error('Failed to parse goals from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event (same-tab + cross-tab)
    const handleCustomEvent = (evt: Event) => {
      if (evt instanceof CustomEvent) {
        callback(evt.detail.goals);
      }
    };

    window.addEventListener('doit_goals_updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('doit_goals_updated', handleCustomEvent);
    };
  }

  export function clearGoals(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  export function validateStorageIntegrity(): boolean {
    try {
      const goals = loadGoals();
      return goals.every(g => typeof g.order === 'number' && g.order >= 0);
    } catch {
      return false;
    }
  }
}
```

### Step 4: Create useSortableGoals Hook

**File**: `app/hooks/use-sortable-goals.ts`

Sortable.js integration hook:

```typescript
import { useEffect, useRef, useState } from 'react';
import Sortable, { SortableEvent } from 'sortable';
import { Goal } from '@/lib/models/goal';
import { GoalOrderService } from '@/lib/services/goal-order-service';

interface UseSortableGoalsOptions {
  status: 'active' | 'completed';
  onReorder?: (goals: Goal[]) => void;
}

export function useSortableGoals(
  goals: Goal[],
  options: UseSortableGoalsOptions
) {
  const sortableRef = useRef<HTMLUListElement | null>(null);
  const sortableInstanceRef = useRef<Sortable | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedGoalId, setDraggedGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (!sortableRef.current) return;

    const sortableInstance = Sortable.create(sortableRef.current, {
      handle: '.drag-handle',           // Only drag from this element
      ghostClass: 'opacity-50',         // CSS class for dragged item
      animation: 150,                   // Smooth animation
      scroll: true,
      scrollSensitivity: 30,            // Auto-scroll trigger
      scrollSpeed: 10,
      fallbackClass: 'sortable-chosen', // Fallback class

      onStart: (evt: SortableEvent) => {
        setIsDragging(true);
        setDraggedGoalId(evt.item.getAttribute('data-id') || null);
      },

      onEnd: (evt: SortableEvent) => {
        setIsDragging(false);
        setDraggedGoalId(null);

        if (evt.oldIndex !== evt.newIndex && options.onReorder) {
          const goalId = evt.item.getAttribute('data-id');
          if (goalId) {
            try {
              const reordered = GoalOrderService.reorderGoalsInColumn(
                goals,
                goalId,
                evt.newIndex!,
                options.status
              );
              options.onReorder(reordered);
            } catch (err) {
              console.error('Reordering failed:', err);
            }
          }
        }
      }
    });

    sortableInstanceRef.current = sortableInstance;

    return () => {
      sortableInstance.destroy();
    };
  }, [goals, options]);

  return {
    sortableRef,
    draggedGoalId,
    isDragging,
    setIsDragging
  };
}
```

### Step 5: Create useGoalCrossSyncStorage Hook

**File**: `app/hooks/use-goal-cross-sync-storage.ts`

Cross-tab synchronization:

```typescript
import { useEffect } from 'react';
import { GoalStorageService } from '@/lib/services/goal-storage-service';
import { Goal } from '@/lib/models/goal';

interface UseGoalCrossSyncStorageOptions {
  onGoalsChange?: (goals: Goal[]) => void;
}

export function useGoalCrossSyncStorage(
  options?: UseGoalCrossSyncStorageOptions
) {
  useEffect(() => {
    if (!options?.onGoalsChange) return;

    // Subscribe to cross-tab storage changes
    const unsubscribe = GoalStorageService.onStorageChange(
      options.onGoalsChange
    );

    return unsubscribe;
  }, [options]);
}
```

### Step 6: Update GoalColumn Component

**File**: `app/components/goal-column.tsx`

Integrate Sortable.js:

```typescript
'use client';

import React from 'react';
import { Goal } from '@/lib/models/goal';
import { useSortableGoals } from '@/hooks/use-sortable-goals';
import GoalCard from './goal-card';

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  status: 'active' | 'completed';
  emptyMessage: string;
  onReorder: (goals: Goal[]) => void;
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalColumn({
  title,
  goals,
  status,
  emptyMessage,
  onReorder,
  onComplete,
  onDelete
}: GoalColumnProps) {
  const { sortableRef, isDragging, draggedGoalId } = useSortableGoals(goals, {
    status,
    onReorder
  });

  return (
    <div className="goal-column flex-1 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

      {goals.length === 0 ? (
        <p className="text-gray-500 italic">{emptyMessage}</p>
      ) : (
        <ul
          ref={sortableRef}
          className="space-y-2 list-none"
          data-status={status}
        >
          {goals.map((goal) => (
            <li
              key={goal.id}
              data-id={goal.id}
              className="cursor-grab active:cursor-grabbing"
            >
              <GoalCard
                goal={goal}
                isDragging={draggedGoalId === goal.id && isDragging}
                status={status}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Step 7: Update GoalDashboard Component

**File**: `app/components/goal-dashboard.tsx`

Integrate cross-tab sync and coordinate columns:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Goal } from '@/lib/models/goal';
import { GoalStorageService } from '@/lib/services/goal-storage-service';
import { GoalOrderService } from '@/lib/services/goal-order-service';
import { useGoalCrossSyncStorage } from '@/hooks/use-goal-cross-sync-storage';
import GoalColumn from './goal-column';

interface GoalDashboardProps {
  initialGoals?: Goal[];
}

export default function GoalDashboard({
  initialGoals
}: GoalDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load initial goals
  useEffect(() => {
    const loadedGoals = initialGoals || GoalStorageService.loadGoals();
    setGoals(loadedGoals);
  }, [initialGoals]);

  // Subscribe to cross-tab storage changes
  useGoalCrossSyncStorage({
    onGoalsChange: (updatedGoals) => {
      setGoals(updatedGoals);
    }
  });

  const handleReorder = (reorderedGoals: Goal[]) => {
    setGoals(reorderedGoals);
    GoalStorageService.saveGoals(reorderedGoals);
  };

  const handleComplete = (goalId: string) => {
    try {
      const updated = GoalOrderService.completeGoal(goals, goalId);
      setGoals(updated);
      GoalStorageService.saveGoals(updated);
    } catch (err) {
      console.error('Failed to complete goal:', err);
    }
  };

  const handleDelete = (goalId: string) => {
    try {
      const updated = GoalOrderService.deleteGoal(goals, goalId);
      setGoals(updated);
      GoalStorageService.saveGoals(updated);
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const activeGoals = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => a.order - b.order);

  const completedGoals = goals
    .filter(g => g.status === 'completed')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <GoalColumn
        title="Active Goals"
        goals={activeGoals}
        status="active"
        emptyMessage="No goals yet. Click 'Add Goal' to get started!"
        onReorder={handleReorder}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />

      <GoalColumn
        title="Completed Goals"
        goals={completedGoals}
        status="completed"
        emptyMessage="Your completed goals will appear here."
        onReorder={handleReorder}
        onComplete={() => {}}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

## Tailwind CSS Styling

Add these utility classes to your Tailwind configuration if not already present:

```css
/* In app/globals.css or tailwind config */

.drag-handle {
  @apply cursor-grab;
}

.drag-handle:active {
  @apply cursor-grabbing;
}

.sortable-ghost {
  @apply opacity-50;
}

.drop-indicator {
  @apply border-t-2 border-blue-400 my-2;
}

.goal-card {
  @apply p-4 bg-gray-50 rounded border border-gray-200 hover:shadow transition-shadow;
}

.goal-card.urgent {
  @apply bg-purple-100 border-purple-300;
}
```

## Testing via npm run dev

**Manual Verification Checklist**:

1. **Basic Drag-and-Drop**:
   - [ ] Open the app in a browser
   - [ ] Add 3-4 goals to active column
   - [ ] Drag first goal to last position
   - [ ] Verify goal moves and order persists on refresh

2. **Visual Feedback**:
   - [ ] Hover over goal → cursor changes to grab
   - [ ] Click and drag goal → goal becomes semi-transparent
   - [ ] Verify drop indicator appears during drag
   - [ ] Release → goal returns to full opacity in new position

3. **Cross-Tab Sync**:
   - [ ] Open app in two browser tabs
   - [ ] In Tab 1: Drag a goal to new position
   - [ ] Switch to Tab 2 → Goal order updates automatically
   - [ ] Verify both tabs show same order

4. **Completed Goals Column**:
   - [ ] Complete a goal (checkbox)
   - [ ] Verify it moves to completed column
   - [ ] Drag goals in completed column
   - [ ] Verify order persists on refresh

5. **Edge Cases**:
   - [ ] Drag goal with very long title → layout doesn't break
   - [ ] Rapidly drag multiple goals → no state corruption
   - [ ] Refresh page during drag → no crash, last good state restored

6. **Accessibility**:
   - [ ] Use keyboard to tab to goal
   - [ ] Use browser DevTools accessibility tree → semantic structure looks good

## Debugging Tips

**Issue**: Drag-and-drop not working
- **Check**: Is Sortable.js installed? (`npm list sortable`)
- **Check**: Does GoalColumn `ref` properly connect to `<ul>`?
- **Check**: Are list items properly marked with `data-id`?

**Issue**: Order not persisting on refresh
- **Check**: Is `GoalStorageService.saveGoals()` being called?
- **Check**: Open DevTools → Application → localStorage → verify "doit_goals"

**Issue**: Cross-tab sync not working
- **Check**: Open two tabs and watch console for 'doit_goals_updated' events
- **Check**: Verify storage event listener is registered in useGoalCrossSyncStorage

**Issue**: Sortable.js conflicts with buttons
- **Check**: Verify buttons have `data-no-drag="true"` attribute

## Performance Considerations

- For 50+ goals: Consider virtual scrolling (out of scope for MVP)
- localStorage is synchronous: For MVP scale, acceptable
- Sortable.js animations: Enabled by default, set `animation: 0` to disable

## Next Steps

1. Commit changes and push to `002-goal-reorder` branch
2. Run `npm run dev` and manually verify all features per "Testing via npm run dev"
3. Request code review against contracts/component-service-interfaces.md
4. Merge to main branch when approved

## Resources

- [Sortable.js Documentation](https://sortablejs.github.io/Sortable/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Version**: 1.0.0 | **Date**: 2026-02-15 | **Status**: Ready for Implementation
