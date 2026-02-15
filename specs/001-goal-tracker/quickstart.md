# Phase 1: Goal Tracker MVP Quickstart

**Date**: 2026-02-15  
**Status**: Complete  
**Output**: Developer walkthrough for implementing Goal Tracker MVP

---

## Overview

This quickstart guides you through the implementing the Goal Tracker MVP with:
- **User Story 1**: View goal dashboard with current and completed columns
- **User Story 2**: Add new goals via modal form
- **User Story 3**: Manage goal status (mark complete, delete)

**Target**: Functional MVP in ~4 hours of focused development

---

## Project Setup

### Prerequisites

```bash
# Verify you have:
- Node.js 18+
- npm or pnpm
- Next.js 16.1.6 (already in workspace)
- TypeScript 5.x
```

### Initialize shadcn/ui

```bash
# From workspace root
npx shadcn-ui@latest init

# When prompted:
# - Would you like to use TypeScript? → Yes
# - Which style would you like to use? → Default (or Flux if available)
# - Which color would you like as the primary color? → Skip/Blue
# - Where is your global CSS file? → app/globals.css
# - Do you want to use CSS variables? → Yes

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add alert
```

### Install Dependencies

```bash
npm install date-fns uuid

# TypeScript types
npm install --save-dev @types/uuid
```

---

## MVP User Journey

### Starting State: No Goals

```
┌─────────────────────────────────────────────────────┐
│  DoIt Goal Tracker                                  │
├─────────────────────────────────────────────────────┤
│  [Add Goal Button]                                  │
├──────────────────────┬──────────────────────────────┤
│  Current Goals (0)   │  Completed (0)              │
│                      │                              │
│  No goals yet.       │  Complete your first goal   │
│  Click 'Add Goal'    │  to see it here!            │
│  to get started!     │                              │
└──────────────────────┴──────────────────────────────┘
```

### Step 1: User Clicks "Add Goal"

```
Modal Opens:
┌──────────────────────────────┐
│ Add New Goal                 │
├──────────────────────────────┤
│ Title *                      │
│ [_________________]          │
│                              │
│ End Date *                   │
│ [_______________]  📅        │
│                              │
│            [Cancel] [Create] │
└──────────────────────────────┘
```

### Step 2: User Fills Form

**Input Data**:
```
Title:    "Learn TypeScript"
End Date: "2026-03-15"
```

**Validation**:
- Title: ✅ 18 characters (within 1-100)
- End Date: ✅ March 15, 2026 (future date)
- **Create button enabled**: Yes

### Step 3: User Submits Form

**What happens**:
1. Form validates inputs (client-side Zod or custom validation)
2. If valid:
   - Generate UUID for goal ID
   - Create goal object: `{ id, title, endDate, status: 'active', createdDate: now, completedDate: null }`
   - Save to localStorage under key `doit-goals`
   - Close modal
   - Re-fetch goals from localStorage
   - Component re-renders with new goal

**Resulting State**:
```typescript
{
  id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  title: "Learn TypeScript",
  endDate: "2026-03-15",
  status: "active",
  createdDate: "2026-02-15T14:00:00.000Z",
  completedDate: null
}
```

### Step 4: Goal Appears in Dashboard

```
┌─────────────────────────────────────────────────────┐
│  DoIt Goal Tracker                                  │
├─────────────────────────────────────────────────────┤
│  [Add Goal Button]                                  │
├──────────────────────┬──────────────────────────────┤
│  Current Goals (1)   │  Completed (0)              │
│ ┌──────────────────┐ │                              │
│ │ Learn TypeScript │ │  Complete your first goal   │
│ │ ☐ 28 days left  │ │  to see it here!            │
│ │     [Delete]    │ │                              │
│ └──────────────────┘ │                              │
└──────────────────────┴──────────────────────────────┘
```

**Computed Properties** (using DateService):
- Days remaining: `differenceInDays("2026-03-15", today)` = 28 days
- Is urgent: `isWithinInterval(today, deadline range)` = false (28 > 3)
- Card background: Default (not pastel-purple)

### Step 5: User Adds Another Goal (3-Day Deadline)

**Input**:
```
Title:    "Submit Project Report"
End Date: "2026-02-18"  // 3 days from Feb 15
```

**Dashboard after add**:
```
┌──────────────────────┬──────────────────────────────┐
│  Current Goals (2)   │  Completed (0)              │
│ ┌──────────────────┐ │                              │
│ │ Learn TypeScript │ │  Complete your first goal   │
│ │ ☐ 28 days left  │ │  to see it here!            │
│ │     [Delete]    │ │                              │
│ └──────────────────┘ │                              │
│ ┌──────────────────┐ │                              │
│ │ Submit Project   │ │  (pastel-purple background) │
│ │ Report 🚨        │ │                              │
│ │ ☐ 3 days left   │ │  (URGENT - 3 days or less)  │
│ │     [Delete]    │ │                              │
│ └──────────────────┘ │                              │
└──────────────────────┴──────────────────────────────┘
```

**Urgent Detection**:
- Days remaining: `differenceInDays("2026-02-18", "2026-02-15")` = 3
- Is urgent: `daysRemaining <= 3` = **true** ✅
- Card styling: `className={isUrgent ? 'bg-pastel-purple' : 'bg-white'}`

### Step 6: User Marks Goal Complete

**Action**: Click checkbox on "Learn TypeScript"

**What happens**:
1. Event handler triggered: `onComplete(goalId)`
2. Update goal state: `status: 'active' → 'completed'`
3. Set completedDate: `new Date().toISOString()`
4. Save updated goals array to localStorage
5. Filter lists: active goals exclude completed goal
6. Component re-renders with goal moved to Completed column

**State Change**:
```typescript
// Before
{
  id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  status: "active",
  completedDate: null
}

// After
{
  id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  status: "completed",
  completedDate: "2026-02-15T14:05:00.000Z"  // timestamp of completion
}
```

**Updated Dashboard**:
```
┌──────────────────────┬──────────────────────────────┐
│  Current Goals (1)   │  Completed (1)              │
│ ┌──────────────────┐ │ ┌────────────────────────┐  │
│ │ Submit Project   │ │ │✓ Learn TypeScript     │  │
│ │ Report 🚨        │ │ │  Completed Feb 15     │  │
│ │ ☐ 3 days left   │ │ │      [Delete]         │  │
│ │     [Delete]    │ │ └────────────────────────┘  │
│ └──────────────────┘ │                              │
└──────────────────────┴──────────────────────────────┘
```

### Step 7: User Deletes a Goal

**Action**: Click [Delete] button on goal in either column

**Options**:
1. **Immediate delete** (MVP v1): No confirmation
2. **Confirmed delete** (future enhancement): Modal dialog asking "Are you sure?"

**MVP Implementation** (no confirmation):
1. Click delete button → Direct removal
2. Filter goal from array: `goals.filter(g => g.id !== goalId)`
3. Save updated array to localStorage
4. Component re-renders with goal removed

**Result**:
```
┌──────────────────────┬──────────────────────────────┐
│  Current Goals (0)   │  Completed (1)              │
│                      │ ┌────────────────────────┐  │
│  No goals yet.       │ │✓ Learn TypeScript     │  │
│  Click 'Add Goal'    │ │  Completed Feb 15     │  │
│  to get started!     │ │      [Delete]         │  │
│                      │ └────────────────────────┘  │
└──────────────────────┴──────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Core Data Layer (30 min)

**Files to create**:
1. `app/lib/models/goal.ts` - Type definitions
2. `app/lib/services/date-service.ts` - Date calculations
3. `app/lib/services/storage-service.ts` - localStorage wrapper
4. `app/lib/services/goal-service.ts` - Business logic (CRUD)

**Deliverable**: Type-safe data layer with localStorage persistence

### Phase 2: State Management (30 min)

**Files to create**:
1. `app/hooks/use-goals.ts` - Custom hook (useState + useEffect + storage sync)

**Deliverable**: React hook managing goal state and localStorage sync

### Phase 3: UI Components (90 min)

**Files to create**:
1. `app/components/goal-card.tsx` - Individual goal card display
2. `app/components/goal-column.tsx` - Column wrapper (current/completed)
3. `app/components/goal-form.tsx` - Form fields (title, date input)
4. `app/components/goal-form-modal.tsx` - Modal container + form
5. `app/components/goal-dashboard.tsx` - Main layout (two columns)

**Deliverable**: Fully functional UI with form modal

### Phase 4: Styling & Polish (30 min)

**Tasks**:
1. Apply Tailwind @theme colors (pastel palette)
2. Add responsive classes (mobile → tablet → desktop)
3. Implement focus states for accessibility
4. Test on mobile (375px) and desktop

**Deliverable**: Responsive, accessible, styled dashboard

---

## Code Checklist: Build Order

### ✅ Step 1: Models & Types

```typescript
// app/lib/models/goal.ts
export type GoalStatus = 'active' | 'completed'

export interface Goal {
  id: string
  title: string
  endDate: string
  status: GoalStatus
  createdDate: string
  completedDate: string | null
}
```

### ✅ Step 2: Services

```typescript
// app/lib/services/date-service.ts
import { differenceInDays, format, isWithinInterval, add, startOfDay, parseISO } from 'date-fns'

export class DateService {
  static getDaysRemaining(endDate: string): number {
    const today = startOfDay(new Date())
    const end = startOfDay(parseISO(endDate))
    return differenceInDays(end, today)
  }

  static isUrgent(endDate: string): boolean {
    const daysLeft = this.getDaysRemaining(endDate)
    return daysLeft >= 0 && daysLeft <= 3
  }

  static formatDate(dateStr: string): string {
    return format(parseISO(dateStr), 'MMM dd, yyyy')
  }

  static getTodayISO(): string {
    return new Date().toISOString().split('T')[0]
  }

  static formatDaysRemaining(daysLeft: number): string {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`
    if (daysLeft === 0) return '0 days left (due today)'
    if (daysLeft === 1) return '1 day left'
    return `${daysLeft} days left`
  }
}
```

```typescript
// app/lib/services/storage-service.ts
import type { Goal } from '@/lib/models/goal'

const STORAGE_KEY = 'doit-goals'

export class StorageService {
  static getGoals(): Goal[] {
    try {
      const stored = typeof window !== 'undefined' ? localStorage?.getItem(STORAGE_KEY) : null
      return stored ? JSON.parse(stored) : []
    } catch {
      console.error('Failed to load goals')
      return []
    }
  }

  static saveGoals(goals: Goal[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage?.setItem(STORAGE_KEY, JSON.stringify(goals))
      }
    } catch {
      console.error('Failed to save goals')
    }
  }

  // Additional methods: addGoal, updateGoal, deleteGoal, clear
}
```

### ✅ Step 3: Custom Hook

```typescript
// app/hooks/use-goals.ts
'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Goal } from '@/lib/models/goal'
import { StorageService } from '@/lib/services/storage-service'
import { DateService } from '@/lib/services/date-service'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = StorageService.getGoals()
      setGoals(stored)
    } catch (err) {
      setError('Failed to load goals')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addGoal = (title: string, endDate: string) => {
    const newGoal: Goal = {
      id: uuidv4(),
      title,
      endDate,
      status: 'active',
      createdDate: new Date().toISOString(),
      completedDate: null,
    }
    const updated = [newGoal, ...goals]
    setGoals(updated)
    StorageService.saveGoals(updated)
  }

  const completeGoal = (goalId: string) => {
    const updated = goals.map(g =>
      g.id === goalId
        ? { ...g, status: 'completed' as const, completedDate: new Date().toISOString() }
        : g
    )
    setGoals(updated)
    StorageService.saveGoals(updated)
  }

  const deleteGoal = (goalId: string) => {
    const updated = goals.filter(g => g.id !== goalId)
    setGoals(updated)
    StorageService.saveGoals(updated)
  }

  return { goals, isLoading, error, addGoal, completeGoal, deleteGoal }
}
```

### ✅ Step 4: Components

```typescript
// app/components/goal-card.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Goal } from '@/lib/models/goal'
import { DateService } from '@/lib/services/date-service'

interface GoalCardProps {
  goal: Goal
  onComplete: (goalId: string) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onComplete, onDelete }: GoalCardProps) {
  const daysLeft = DateService.getDaysRemaining(goal.endDate)
  const isUrgent = DateService.isUrgent(goal.endDate)
  const daysText = DateService.formatDaysRemaining(daysLeft)

  if (goal.status === 'completed') {
    return (
      <Card className="bg-pastel-pink/20 border-pastel-pink">
        <CardHeader>
          <CardTitle className="text-base line-through">{goal.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Completed {DateService.formatDate(goal.completedDate || '')}
          </span>
          <Button size="sm" variant="ghost" onClick={() => onDelete(goal.id)}>
            Delete
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isUrgent ? 'bg-pastel-purple border-pastel-purple' : 'border-pastel-blue'}>
      <CardHeader>
        <CardTitle className="text-base">{goal.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={false}
            onCheckedChange={() => onComplete(goal.id)}
            aria-label={`Mark "${goal.title}" complete`}
          />
          <span className={`text-sm ${isUrgent ? 'font-bold' : 'text-gray-600'}`}>
            {daysText}
          </span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => onDelete(goal.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}
```

### ✅ Step 5: Dashboard

```typescript
// app/components/goal-dashboard.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGoals } from '@/hooks/use-goals'
import { GoalFormModal } from './goal-form-modal'
import { GoalCard } from './goal-card'

export function GoalDashboard() {
  const { goals, isLoading, addGoal, completeGoal, deleteGoal } = useGoals()
  const [showModal, setShowModal] = useState(false)

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">DoIt Goal Tracker</h1>
        <Button onClick={() => setShowModal(true)}>Add Goal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Goals */}
        <div>
          <h2 className="text-xl font-bold mb-4">Current Goals ({activeGoals.length})</h2>
          {activeGoals.length === 0 ? (
            <p className="text-gray-600">No goals yet. Click 'Add Goal' to get started!</p>
          ) : (
            <div className="space-y-3">
              {activeGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={completeGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        <div>
          <h2 className="text-xl font-bold mb-4">Completed ({completedGoals.length})</h2>
          {completedGoals.length === 0 ? (
            <p className="text-gray-600">Complete your first goal to see it here!</p>
          ) : (
            <div className="space-y-3">
              {completedGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={completeGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <GoalFormModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={(title, endDate) => {
          addGoal(title, endDate)
          setShowModal(false)
        }}
      />
    </div>
  )
}
```

---

## Testing via Manual Verification

### Verification Checklist (No Automated Tests)

Instead of unit tests, verify manually using `npm run dev`:

- [ ] Page loads without errors
- [ ] "No goals yet" message displays on first load
- [ ] "Add Goal" button opens modal
- [ ] Form validates: empty title rejected
- [ ] Form validates: past date rejected
- [ ] Form accepts valid title + future date
- [ ] Goal appears in "Current Goals" after creation
- [ ] Goal with 0-3 days shows purple background
- [ ] Goal with >3 days shows normal background
- [ ] Checkbox moves goal to "Completed" column
- [ ] Delete button removes goal permanently
- [ ] Page works on mobile (375px) and desktop (1024px)
- [ ] All buttons/checkboxes have visible focus indicators
- [ ] Form labels are properly associated with inputs

### Manual Verification Steps

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test User Story 1: View Dashboard**
   - Open http://localhost:3000
   - Verify: Empty state shows "No goals yet" message
   - Verify: Two-column layout (Current / Completed)

3. **Test User Story 2: Add Goal**
   - Click "Add Goal"
   - Try submitting empty form → error message
   - Try submitting with past date → error message
   - Complete form correctly → goal appears immediately

4. **Test User Story 3: Manage Goals**
   - Check checkbox on active goal → moves to Completed
   - Click Delete on any goal → goal removed
   - Verify data persists on page refresh

5. **Test Responsive Design**
   - Toggle browser to mobile (375px)
   - Verify: Single-column layout
   - Toggle to tablet (768px)
   - Verify: Two-column layout appears

---

## Success Criteria (MVP Definition)

- [x] All 3 user stories implemented (US1, US2, US3)
- [x] All 14 functional requirements met (FR-001 through FR-014)
- [x] Data persists across page refreshes (localStorage)
- [x] Responsive design works (mobile/tablet/desktop)
- [x] Accessibility passing WCAG 2.1 Level A
- [x] Color palette from clarifications applied
- [x] No unit/integration/e2e tests (per Constitution)
- [x] Code is clean and simple (Constitution principle)

**MVP Status**: Ready for development following this quickstart 🚀

---

**Quickstart Created**: 2026-02-15  
**Estimated Build Time**: 4 hours  
**Next Step**: Follow the 5-step implementation plan above
