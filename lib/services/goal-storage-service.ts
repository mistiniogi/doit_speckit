import type { Goal, GoalList } from '@/lib/models/goal'
import { GoalOrderService } from './goal-order-service'

const STORAGE_KEY = 'doIt_goals'
const STORAGE_VERSION = 1

/**
 * GoalStorageService: Manages persistence to localStorage and cross-tab synchronization
 * Emits custom events for storage changes to enable cross-tab sync
 */
export class GoalStorageService {
  /**
   * Load goals from localStorage, with auto-migration of order property
   * @returns Array of goals, or empty array if not in localStorage
   */
  static loadGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }

      const data = JSON.parse(stored) as GoalList
      const goals = data.goals || []

      // Auto-migrate: ensure all goals have order property
      const migratedGoals = this.migrateGoalOrder(goals)
      return migratedGoals
    } catch (error) {
      console.error('Failed to load goals from localStorage:', error)
      return []
    }
  }

  /**
   * Save goals to localStorage and emit custom event for cross-tab sync
   * @param goals Array of goals to persist
   * @returns true if save succeeded, false otherwise
   */
  static saveGoals(goals: Goal[]): boolean {
    try {
      const goalList: GoalList = {
        goals,
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: STORAGE_VERSION,
        },
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(goalList))

      // Emit custom event for cross-tab sync (other tabs listen for this)
      const event = new CustomEvent('goalsChanged', {
        detail: { goals, timestamp: Date.now() },
      })
      window.dispatchEvent(event)

      return true
    } catch (error) {
      console.error('Failed to save goals to localStorage:', error)
      return false
    }
  }

  /**
   * Subscribe to storage changes (both from other tabs and this tab)
   * Cross-tab sync: when another tab modifies localStorage, window 'storage' event fires
   * Same-tab changes: listen to custom 'goalsChanged' event
   * @param callback Function called when goals change, receives updated goals array
   * @returns Unsubscribe function to remove listener
   */
  static onStorageChange(callback: (goals: Goal[]) => void): () => void {
    // Handle storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as GoalList
          callback(parsed.goals || [])
        } catch (error) {
          console.error('Failed to parse storage change:', error)
        }
      }
    }

    // Handle custom events from same tab
    const handleGoalsChanged = (event: Event) => {
      if (event instanceof CustomEvent) {
        callback(event.detail.goals)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('goalsChanged', handleGoalsChanged)

    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('goalsChanged', handleGoalsChanged)
    }
  }

  /**
   * Clear all goals from storage (destructive operation)
   * @returns true if clear succeeded
   */
  static clearGoals(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear goals from localStorage:', error)
      return false
    }
  }

  /**
   * Validate storage integrity and correctness
   * @returns { valid: boolean, errors: string[] }
   */
  static validateStorageIntegrity(): { valid: boolean; errors: string[] } {
    try {
      const goals = this.loadGoals()

      // Check order validity
      const orderValidation = GoalOrderService.validateGoalOrder(goals)
      if (!orderValidation.valid) {
        return { valid: false, errors: orderValidation.errors }
      }

      // Check for duplicate IDs
      const ids = goals.map((g) => g.id)
      const uniqueIds = new Set(ids)
      if (ids.length !== uniqueIds.size) {
        return { valid: false, errors: ['Duplicate goal IDs detected'] }
      }

      // Check all goals have required fields
      for (const goal of goals) {
        if (!goal.id || !goal.title || !goal.endDate || !goal.status || goal.order === undefined) {
          return { valid: false, errors: ['Goal missing required fields'] }
        }
      }

      return { valid: true, errors: [] }
    } catch (error) {
      return { valid: false, errors: [`Storage validation error: ${error}`] }
    }
  }

  /**
   * Auto-migrate goals that lack the order property
   * @param goals Goals array (may be missing order property)
   * @returns Migrated goals with order property guaranteed
   */
  private static migrateGoalOrder(goals: Goal[]): Goal[] {
    // Check if any goals are missing order property
    const needsMigration = goals.some((g) => g.order === undefined)

    if (!needsMigration) {
      return goals
    }

    // Repair order for all goals
    const migrated = GoalOrderService.repairGoalOrder(goals)

    // Persist the migrated data silently
    try {
      this.saveGoals(migrated)
    } catch (error) {
      console.warn('Failed to persist migrated goal order:', error)
    }

    return migrated
  }
}
