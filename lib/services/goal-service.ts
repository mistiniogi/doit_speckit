import type { Goal, GoalWithComputed, AddGoalInput } from '@/lib/models/goal'
import { DateService } from './date-service'
import { StorageService } from './storage-service'
import { v4 as uuidv4 } from 'uuid'

/**
 * GoalService: Orchestrates CRUD operations and business logic for goals
 * Combines DateService for calculations and StorageService for persistence
 */
export class GoalService {
  /**
   * Get all goals with computed properties
   * @returns Array of goals with computed daysRemaining, isUrgent, etc.
   */
  static getAllGoals(): GoalWithComputed[] {
    const goals = StorageService.getGoals()
    return goals.map((goal) => this.enrichGoal(goal))
  }

  /**
   * Get active goals (status === 'active')
   * @returns Array of active goals with computed properties
   */
  static getActiveGoals(): GoalWithComputed[] {
    return this.getAllGoals().filter((goal) => goal.status === 'active')
  }

  /**
   * Get completed goals (status === 'completed'), sorted newest first
   * @returns Array of completed goals with computed properties
   */
  static getCompletedGoals(): GoalWithComputed[] {
    return this.getAllGoals()
      .filter((goal) => goal.status === 'completed')
      .sort(
        (a, b) =>
          new Date(b.completedDate || '').getTime() -
          new Date(a.completedDate || '').getTime()
      )
  }

  /**
   * Create a new goal
   * @param input AddGoalInput with title and endDate
   * @returns Created goal object or null if validation fails
   */
  static createGoal(input: AddGoalInput): Goal | null {
    try {
      // Validate inputs
      if (!input.title || input.title.trim().length === 0) {
        console.error('Goal title is required')
        return null
      }

      if (input.title.length > 100) {
        console.error('Goal title must be 100 characters or less')
        return null
      }

      const dateValidation = DateService.validateFutureDate(input.endDate)
      if (!dateValidation.valid) {
        console.error(dateValidation.error)
        return null
      }

      const goal: Goal = {
        id: uuidv4(),
        title: input.title.trim(),
        endDate: input.endDate,
        status: 'active',
        createdDate: DateService.getNowISO(),
        completedDate: null,
      }

      if (StorageService.addGoal(goal)) {
        return goal
      }

      return null
    } catch (error) {
      console.error('Error creating goal:', error)
      return null
    }
  }

  /**
   * Mark a goal as complete
   * @param goalId Goal ID to complete
   * @returns true if successful, false otherwise
   */
  static completeGoal(goalId: string): boolean {
    try {
      return StorageService.updateGoal(goalId, {
        status: 'completed',
        completedDate: DateService.getNowISO(),
      })
    } catch (error) {
      console.error('Error completing goal:', error)
      return false
    }
  }

  /**
   * Delete a goal
   * @param goalId Goal ID to delete
   * @returns true if successful, false otherwise
   */
  static deleteGoal(goalId: string): boolean {
    try {
      return StorageService.deleteGoal(goalId)
    } catch (error) {
      console.error('Error deleting goal:', error)
      return false
    }
  }

  /**
   * Reactivate a completed goal
   * @param goalId Goal ID to reactivate
   * @returns true if successful, false otherwise
   */
  static reactivateGoal(goalId: string): boolean {
    try {
      return StorageService.updateGoal(goalId, {
        status: 'active',
        completedDate: null,
      })
    } catch (error) {
      console.error('Error reactivating goal:', error)
      return false
    }
  }

  /**
   * Get a single goal by ID with computed properties
   * @param goalId Goal ID to retrieve
   * @returns Goal with computed properties or null if not found
   */
  static getGoalById(goalId: string): GoalWithComputed | null {
    const goals = StorageService.getGoals()
    const goal = goals.find((g) => g.id === goalId)
    return goal ? this.enrichGoal(goal) : null
  }

  /**
   * Clear all goals (use with caution)
   * @returns true if successful, false otherwise
   */
  static clearAll(): boolean {
    try {
      return StorageService.clear()
    } catch (error) {
      console.error('Error clearing all goals:', error)
      return false
    }
  }

  /**
   * Enrich a goal with computed properties
   * @param goal Base goal object
   * @returns Goal with computed properties
   */
  private static enrichGoal(goal: Goal): GoalWithComputed {
    const daysRemaining = DateService.getDaysRemaining(goal.endDate)
    return {
      ...goal,
      daysRemaining,
      isUrgent: DateService.isUrgent(goal.endDate),
      daysRemainingText: DateService.formatDaysRemaining(goal.endDate),
      endDateFormatted: DateService.formatDate(goal.endDate),
      completedDateFormatted: goal.completedDate
        ? DateService.formatDate(goal.completedDate)
        : '',
    }
  }
}
