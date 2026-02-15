# Phase 1: Data Model & Entity Definitions

**Date**: 2026-02-15  
**Status**: Complete  
**Output**: Detailed type definitions, entity relationships, validation rules

---

## Goal Entity Definition

### Core Goal Type

```typescript
// app/lib/models/goal.ts
import type { z } from 'zod'

export type GoalStatus = 'active' | 'completed'

export interface Goal {
  /** Unique identifier (UUID v4) */
  id: string
  
  /** User-entered goal title (1-100 characters) */
  title: string
  
  /** Target end date in ISO 8601 format (YYYY-MM-DD) */
  endDate: string
  
  /** Current status: active or completed */
  status: GoalStatus
  
  /** ISO 8601 timestamp when goal was created */
  createdDate: string
  
  /** ISO 8601 timestamp when goal was marked complete (null if still active) */
  completedDate: string | null
}
```

### Computed Properties (Not Stored)

```typescript
export interface GoalWithComputed extends Goal {
  /** Days remaining until endDate (negative if overdue) */
  daysRemaining: number
  
  /** True if daysRemaining is 0-3 (urgent range) */
  isUrgent: boolean
  
  /** Human-readable days remaining string */
  daysRemainingText: string
  
  /** Formatted endDate for display (e.g., "Feb 15, 2026") */
  endDateFormatted: string
  
  /** Formatted completedDate or empty string */
  completedDateFormatted: string
}
```

---

## Form Input Validation

### Add Goal Form

```typescript
// Input constraints (from spec FR-004, FR-005, FR-006)
export interface AddGoalInput {
  title: string      // Required, 1-100 chars, non-empty
  endDate: string    // Required, ISO date YYYY-MM-DD, future or today
}
```

### Validation Rules (to be implemented in form component)

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, 1-100 chars | "Title must be 1-100 characters" |
| `title` | Not just whitespace | "Title cannot be empty" |
| `endDate` | Required | "End date is required" |
| `endDate` | Valid ISO date | "Invalid date format" |
| `endDate` | Today or future | "End date must be today or in the future" |
| `endDate` | Within 1 year | "End date must be within 1 year" |

### Zod Schema (Optional, for validation)

```typescript
import { z } from 'zod'

export const addGoalFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .trim(),
  endDate: z
    .string()
    .refine(
      (date) => {
        const parsed = new Date(date)
        return !isNaN(parsed.getTime())
      },
      'Invalid date format'
    )
    .refine(
      (date) => {
        const chosen = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return chosen >= today
      },
      'End date must be today or in the future'
    )
})

export type AddGoalFormData = z.infer<typeof addGoalFormSchema>
```

---

## GoalList Entity

### Definition

```typescript
// Represents the collection of goals at any point
export interface GoalList {
  /** All goals (both active and completed) */
  goals: Goal[]
  
  /** Metadata (for future features) */
  metadata: {
    lastUpdated: string  // ISO timestamp of last modification
    version: number      // For potential future migrations
  }
}
```

### Derived Queries

```typescript
// Helper functions to derive lists from GoalList
export function getActiveGoals(goalList: GoalList): Goal[] {
  return goalList.goals
    .filter(goal => goal.status === 'active')
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
}

export function getCompletedGoals(goalList: GoalList): Goal[] {
  return goalList.goals
    .filter(goal => goal.status === 'completed')
    .sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''))
}

export function getUrgentGoals(goalList: GoalList): Goal[] {
  // Goals with 0-3 days remaining (includes overdue)
  return getActiveGoals(goalList).filter(goal => {
    // Implementation detail: use DateService.isUrgent()
    return daysUntilDeadline(goal.endDate) <= 3
  })
}
```

### Business Rules

| Rule | Enforcement |
|------|-------------|
| Duplicate titles allowed | No (user may have multiple "Learn React" goals with different dates) |
| Delete removes goal permanently | Yes (no soft deletes, historical completions are lost) |
| Status change only: active → completed | Yes (no re-opening goals) |
| Completed date auto-populated | Yes (set to current timestamp when completed) |
| Created date immutable | Yes (never changes after creation) |

---

## Storage Format & Serialization

### localStorage Representation

```json
{
  "goals": [
    {
      "id": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
      "title": "Complete React Course",
      "endDate": "2026-03-15",
      "status": "active",
      "createdDate": "2026-02-15T10:30:00.000Z",
      "completedDate": null
    },
    {
      "id": "b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7",
      "title": "Build a Web App",
      "endDate": "2026-02-28",
      "status": "completed",
      "createdDate": "2026-02-01T14:00:00.000Z",
      "completedDate": "2026-02-20T16:45:00.000Z"
    }
  ],
  "metadata": {
    "lastUpdated": "2026-02-15T18:20:00.000Z",
    "version": 1
  }
}
```

### Deserialization Logic

```typescript
export function deserializeGoal(raw: unknown): Goal {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid goal object')
  }
  
  const obj = raw as Record<string, unknown>
  
  return {
    id: String(obj.id || ''),
    title: String(obj.title || ''),
    endDate: String(obj.endDate || ''),
    status: (obj.status === 'active' || obj.status === 'completed') 
      ? obj.status 
      : 'active',
    createdDate: String(obj.createdDate || new Date().toISOString()),
    completedDate: obj.completedDate ? String(obj.completedDate) : null,
  }
}

export function deserializeGoals(raw: unknown): Goal[] {
  if (!Array.isArray(raw)) return []
  return raw.map(g => {
    try {
      return deserializeGoal(g)
    } catch {
      return null
    }
  }).filter(Boolean) as Goal[]
}
```

---

## State Shape in React

### useGoals Hook State

```typescript
// app/hooks/use-goals.ts
export interface GoalsState {
  goals: Goal[]
  isLoading: boolean
  error: string | null
}

export interface GoalsActions {
  addGoal: (title: string, endDate: string) => void
  completeGoal: (goalId: string) => void
  deleteGoal: (goalId: string) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  loadGoals: () => void
  clearError: () => void
}

export type UseGoalsReturn = GoalsState & GoalsActions
```

### Example Component Usage

```typescript
export function GoalDashboard() {
  const { goals, isLoading, error, addGoal, completeGoal, deleteGoal } = useGoals()
  
  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  
  if (isLoading) return <div>Loading...</div>
  
  if (error) return <div role="alert" className="text-red-600">{error}</div>
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2>Current Goals ({activeGoals.length})</h2>
        {activeGoals.length === 0 ? (
          <p>No goals yet. Click 'Add Goal' to get started!</p>
        ) : (
          activeGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal}
              onComplete={() => completeGoal(goal.id)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))
        )}
      </div>
      <div>
        <h2>Completed ({completedGoals.length})</h2>
        {completedGoals.length === 0 ? (
          <p>Complete your first goal to see it here!</p>
        ) : (
          completedGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} isCompleted />
          ))
        )}
      </div>
    </div>
  )
}
```

---

## Data Transitions & State Flows

### Goal Lifecycle State Diagram

```
┌─────────────┐
│   CREATE    │  User submits "Add Goal" form
└──────┬──────┘
       │ title, endDate provided
       │ id generated (uuid)
       │ status = 'active'
       │ createdDate = now
       │ completedDate = null
       ▼
┌──────────────────┐
│   ACTIVE GOAL    │  Goal appears in "Current Goals" column
└──────┬───────────┘
       │
       ├─ User checks checkbox
       │  ▼
       │ ┌──────────────────────┐
       │ │  COMPLETE TRANSITION │  modal confirmation (future)
       │ │ completedDate = now  │
       │ └──────────┬───────────┘
       │            ▼
       │         Active → Completed Column
       │
       └─ User clicks delete
          ▼
       ┌──────────────┐
       │   DELETED    │  Removed from localStorage
       └──────────────┘
```

### Add Goal Flow

```
User Input → Validation → ID Generation → Timestamp → Storage → UI Update
   (form)     (Zod)       (uuid.v4())      (now)      (localStorage)  (re-render)
```

### Complete Goal Flow

```
Checkbox Clicked → State Update → Timestamp → Storage Update → UI Move
(event handler)   (status change) (completedDate) (localStorage)   (filtered lists)
```

### Delete Goal Flow

```
Delete Button → Confirmation (Future) → Removal from Array → Storage Update → UI Update
(event handler) (optional modal)       (filter by id)      (localStorage)   (re-render)
```

---

## Validation Output Examples

### Success Case: Add Goal

**Input**:
```json
{
  "title": "Learn TypeScript",
  "endDate": "2026-03-01"
}
```

**Processing**:
1. Validate title: ✅ 18 chars, 1-100 range
2. Validate endDate: ✅ Valid ISO date, in future (relative to 2026-02-15)
3. Generate id: `uuid v4 → "f47ac10b-58cc-4372-a567-0e02b2c3d479"`
4. Create goal object with timestamps
5. Add to goals array in localStorage
6. Return created goal to component

**Output**:
```typescript
{
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  title: "Learn TypeScript",
  endDate: "2026-03-01",
  status: "active",
  createdDate: "2026-02-15T12:00:00.000Z",
  completedDate: null
}
```

### Failure Case: Add Goal

**Input**:
```json
{
  "title": "",
  "endDate": "2026-01-01"
}
```

**Validation Errors**:
1. Title: ❌ "Title must be 1-100 characters"
2. EndDate: ❌ "End date must be today or in the future"

**User Feedback**:
- Display errors inline on form fields
- Prevent submission (button disabled)
- Example toast or inline alert: "Please fix the errors above"

---

## Migration Considerations (Future)

### Version 1 → Version 2 (Example)

If future feature adds goal categories:

```typescript
// Current (v1)
interface Goal {
  id: string
  title: string
  endDate: string
  status: GoalStatus
  createdDate: string
  completedDate: string | null
}

// Proposed (v2)
interface Goal {
  id: string
  title: string
  endDate: string
  status: GoalStatus
  createdDate: string
  completedDate: string | null
  category?: string  // NEW field, optional for backwards compat
}

// Migration function
export function migrateGoalV1ToV2(v1Goal: any): Goal {
  return {
    ...v1Goal,
    category: undefined  // or default category
  }
}
```

---

## Summary: Data Model

**Entities Defined**:
1. ✅ Goal (6 required fields, 4 computed properties)
2. ✅ GoalList (collection + metadata)
3. ✅ AddGoalInput (form shape with validation rules)

**Business Rules Enforced**:
- [x] Unique IDs (UUID v4)
- [x] Immutable created/completed timestamps
- [x] One-way status transition (active → completed only)
- [x] Hard delete (no restoration)
- [x] Title length limits (1-100 chars)
- [x] Date future validation

**Storage Format**:
- [x] JSON serialization in localStorage
- [x] Deserialization with type safety
- [x] Error handling for corrupted data

**Ready for Phase 2**: Component implementation can now proceed with complete type safety and business logic clarity.

---

**Data Model Completed**: 2026-02-15  
**Next Phase**: Phase 2 (quickstart.md, task generation)
