'use client'

import { useEffect, useState } from 'react'
import type { Goal, GoalWithComputed, AddGoalInput } from '@/lib/models/goal'
import { GoalService } from '@/lib/services/goal-service'

/**
 * useGoals: Custom hook for managing goal state and operations
 * Handles localStorage sync, provides CRUD operations
 */
export function useGoals() {
  const [goals, setGoals] = useState<GoalWithComputed[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize goals from localStorage on mount
  useEffect(() => {
    try {
      const allGoals = GoalService.getAllGoals()
      setGoals(allGoals)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Add a new goal
   * @param input Goal input (title, endDate)
   * @returns true if successful, false otherwise
   */
  const addGoal = (input: AddGoalInput): boolean => {
    try {
      const newGoal = GoalService.createGoal(input)
      if (newGoal) {
        // Refresh goals from service to get all computed properties
        const allGoals = GoalService.getAllGoals()
        setGoals(allGoals)
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding goal:', error)
      return false
    }
  }

  /**
   * Mark a goal as complete
   * @param goalId Goal ID to complete
   * @returns true if successful, false otherwise
   */
  const completeGoal = (goalId: string): boolean => {
    try {
      const success = GoalService.completeGoal(goalId)
      if (success) {
        const allGoals = GoalService.getAllGoals()
        setGoals(allGoals)
        return true
      }
      return false
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
  const deleteGoal = (goalId: string): boolean => {
    try {
      const success = GoalService.deleteGoal(goalId)
      if (success) {
        const allGoals = GoalService.getAllGoals()
        setGoals(allGoals)
        return true
      }
      return false
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
  const reactivateGoal = (goalId: string): boolean => {
    try {
      const success = GoalService.reactivateGoal(goalId)
      if (success) {
        const allGoals = GoalService.getAllGoals()
        setGoals(allGoals)
        return true
      }
      return false
    } catch (error) {
      console.error('Error reactivating goal:', error)
      return false
    }
  }

  /**
   * Get active goals (status === 'active')
   */
  const activeGoals = goals.filter((goal) => goal.status === 'active')

  /**
   * Get completed goals (status === 'completed'), sorted newest first
   */
  const completedGoals = goals
    .filter((goal) => goal.status === 'completed')
    .sort(
      (a, b) =>
        new Date(b.completedDate || '').getTime() -
        new Date(a.completedDate || '').getTime()
    )

  return {
    goals,
    activeGoals,
    completedGoals,
    isLoading,
    addGoal,
    completeGoal,
    deleteGoal,
    reactivateGoal,
  }
}
