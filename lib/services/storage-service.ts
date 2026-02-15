import type { Goal, GoalList } from '@/lib/models/goal'
import { DateService } from './date-service'

const STORAGE_KEY = 'doit-goals'

/**
 * StorageService: Handles localStorage persistence for goals
 */
export class StorageService {
  /**
   * Get all goals from localStorage
   * @returns Array of goals or empty array if none exist
   */
  static getGoals(): Goal[] {
    try {
      if (typeof window === 'undefined') {
        return []
      }

      const data = window.localStorage.getItem(STORAGE_KEY)
      if (!data) {
        return []
      }

      const parsed = JSON.parse(data) as GoalList
      return parsed.goals || []
    } catch (error) {
      console.error('Error reading goals from localStorage:', error)
      return []
    }
  }

  /**
   * Save goals array to localStorage
   * @param goals Array of goals to save
   * @returns true if successful, false otherwise
   */
  static saveGoals(goals: Goal[]): boolean {
    try {
      if (typeof window === 'undefined') {
        return false
      }

      const goalList: GoalList = {
        goals,
        metadata: {
          lastUpdated: DateService.getNowISO(),
          version: 1,
        },
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goalList))
      return true
    } catch (error) {
      console.error('Error saving goals to localStorage:', error)
      return false
    }
  }

  /**
   * Add a new goal to localStorage
   * @param goal Goal to add
   * @returns true if successful, false otherwise
   */
  static addGoal(goal: Goal): boolean {
    try {
      const goals = this.getGoals()
      const updated = [goal, ...goals]
      return this.saveGoals(updated)
    } catch (error) {
      console.error('Error adding goal:', error)
      return false
    }
  }

  /**
   * Update an existing goal
   * @param goalId Goal ID to update
   * @param updates Partial goal updates
   * @returns true if successful, false otherwise
   */
  static updateGoal(goalId: string, updates: Partial<Goal>): boolean {
    try {
      const goals = this.getGoals()
      const updated = goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
      return this.saveGoals(updated)
    } catch (error) {
      console.error('Error updating goal:', error)
      return false
    }
  }

  /**
   * Delete a goal by ID
   * @param goalId Goal ID to delete
   * @returns true if successful, false otherwise
   */
  static deleteGoal(goalId: string): boolean {
    try {
      const goals = this.getGoals()
      const updated = goals.filter((goal) => goal.id !== goalId)
      return this.saveGoals(updated)
    } catch (error) {
      console.error('Error deleting goal:', error)
      return false
    }
  }

  /**
   * Clear all goals from localStorage
   * @returns true if successful, false otherwise
   */
  static clear(): boolean {
    try {
      if (typeof window === 'undefined') {
        return false
      }

      window.localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}
