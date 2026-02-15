import type { z } from 'zod'

export type GoalStatus = 'active' | 'completed'

/**
 * Core Goal entity
 */
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

/**
 * Goal with computed properties (not stored, calculated on demand)
 */
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

/**
 * Form input constraints
 */
export interface AddGoalInput {
  title: string // Required, 1-100 chars, non-empty
  endDate: string // Required, ISO date YYYY-MM-DD, future or today
}

/**
 * Represents the collection of goals at any point
 */
export interface GoalList {
  /** All goals (both active and completed) */
  goals: Goal[]

  /** Metadata for potential future features */
  metadata: {
    lastUpdated: string // ISO timestamp of last modification
    version: number // For potential future migrations
  }
}

/**
 * Helper functions to derive lists from GoalList
 */
export function getActiveGoals(goalList: GoalList): Goal[] {
  return goalList.goals
    .filter((goal) => goal.status === 'active')
    .sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    )
}

export function getCompletedGoals(goalList: GoalList): Goal[] {
  return goalList.goals
    .filter((goal) => goal.status === 'completed')
    .sort(
      (a, b) =>
        new Date(b.completedDate || '').getTime() -
        new Date(a.completedDate || '').getTime()
    )
}
