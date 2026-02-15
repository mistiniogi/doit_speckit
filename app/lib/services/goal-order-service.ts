import type { Goal, GoalStatus } from '@/lib/models/goal'

/**
 * GoalOrderService: Manages goal reordering logic across columns
 * Maintains invariant: order values within each status group are contiguous [0, 1, 2, ...]
 */
export class GoalOrderService {
  /**
   * Reorder a goal within its column
   * @param goals All goals
   * @param goalId Goal to move
   * @param newIndex New position within the status group (0-based)
   * @param status Target column status
   * @returns Updated goals array with new order values
   */
  static reorderGoalsInColumn(
    goals: Goal[],
    goalId: string,
    newIndex: number,
    status: GoalStatus
  ): Goal[] {
    // Get all goals in the target status group, sorted by current order
    const goalsInStatus = goals
      .filter((g) => g.status === status)
      .sort((a, b) => a.order - b.order)

    // Find the goal being moved
    const currentIndex = goalsInStatus.findIndex((g) => g.id === goalId)
    if (currentIndex === -1) {
      throw new Error(`Goal ${goalId} not found in ${status} column`)
    }

    // Clamp newIndex to valid range
    const clampedIndex = Math.max(0, Math.min(newIndex, goalsInStatus.length - 1))

    // Remove from current position
    const reordered = [...goalsInStatus]
    const [movedGoal] = reordered.splice(currentIndex, 1)

    // Insert at new position
    reordered.splice(clampedIndex, 0, movedGoal)

    // Reassign order values [0, 1, 2, ...] to maintain contiguity
    const withNewOrder = reordered.map((g, idx) => ({
      ...g,
      order: idx,
    }))

    // Merge back with other status group (unchanged)
    const otherStatus = status === 'active' ? 'completed' : 'active'
    const unchanged = goals.filter((g) => g.status === otherStatus)

    return [...withNewOrder, ...unchanged]
  }

  /**
   * Get all goals in a specific column (status), sorted by order
   * @param goals All goals
   * @param status Column status to filter
   * @returns Goals in that column, sorted by order ascending
   */
  static getGoalsInStatus(goals: Goal[], status: GoalStatus): Goal[] {
    return goals.filter((g) => g.status === status).sort((a, b) => a.order - b.order)
  }

  /**
   * Move a goal from active to completed column
   * Assigns it the max order + 1 in the completed group
   * @param goals All goals
   * @param goalId Goal to complete
   * @returns Updated goals
   */
  static completeGoal(goals: Goal[], goalId: string): Goal[] {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`)
    }

    if (goal.status === 'completed') {
      // Already completed, no change
      return goals
    }

    // Get max order in completed group
    const completedGoals = goals.filter((g) => g.status === 'completed')
    const maxCompletedOrder = completedGoals.length > 0 ? Math.max(...completedGoals.map((g) => g.order)) : -1

    // Update goal and repair active column order
    const updatedGoal = {
      ...goal,
      status: 'completed' as GoalStatus,
      completedDate: new Date().toISOString(),
      order: maxCompletedOrder + 1,
    }

    // Remove from active, repair its order
    const activeGoals = this.getGoalsInStatus(goals, 'active').filter((g) => g.id !== goalId)
    const reorderedActive = activeGoals.map((g, idx) => ({ ...g, order: idx }))

    // Return updated goals
    const unchanged = goals.filter((g) => g.status === 'completed' && g.id !== goalId)
    return [...reorderedActive, updatedGoal, ...unchanged]
  }

  /**
   * Delete a goal and repair order in its column
   * @param goals All goals
   * @param goalId Goal to delete
   * @returns Updated goals array
   */
  static deleteGoal(goals: Goal[], goalId: string): Goal[] {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`)
    }

    // Get goals in the same status (excluding the deleted goal)
    const remaining = goals.filter((g) => g.status !== goal.status)
    const inStatus = this.getGoalsInStatus(goals, goal.status).filter((g) => g.id !== goalId)

    // Repair order values
    const reordered = inStatus.map((g, idx) => ({ ...g, order: idx }))

    return [...reordered, ...remaining]
  }

  /**
   * Validate that order values within each status group are contiguous [0, 1, 2, ...]
   * @param goals All goals
   * @returns { valid: boolean, errors: string[] }
   */
  static validateGoalOrder(goals: Goal[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check active goals
    const activeGoals = this.getGoalsInStatus(goals, 'active')
    if (activeGoals.length > 0) {
      const activeOrders = activeGoals.map((g) => g.order).sort((a, b) => a - b)
      for (let i = 0; i < activeOrders.length; i++) {
        if (activeOrders[i] !== i) {
          errors.push(
            `Active goals have non-contiguous order: expected [0..${activeOrders.length - 1}], got ${activeOrders.join(',')}`
          )
          break
        }
      }
    }

    // Check completed goals
    const completedGoals = this.getGoalsInStatus(goals, 'completed')
    if (completedGoals.length > 0) {
      const completedOrders = completedGoals.map((g) => g.order).sort((a, b) => a - b)
      for (let i = 0; i < completedOrders.length; i++) {
        if (completedOrders[i] !== i) {
          errors.push(
            `Completed goals have non-contiguous order: expected [0..${completedOrders.length - 1}], got ${completedOrders.join(',')}`
          )
          break
        }
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Repair goal order by reassigning contiguous values [0, 1, 2, ...]
   * Useful for data migrations or corruption recovery
   * @param goals All goals
   * @returns Repaired goals array
   */
  static repairGoalOrder(goals: Goal[]): Goal[] {
    const activeGoals = this.getGoalsInStatus(goals, 'active')
    const completedGoals = this.getGoalsInStatus(goals, 'completed')

    const repairedActive = activeGoals.map((g, idx) => ({ ...g, order: idx }))
    const repairedCompleted = completedGoals.map((g, idx) => ({ ...g, order: idx }))

    return [...repairedActive, ...repairedCompleted]
  }
}
