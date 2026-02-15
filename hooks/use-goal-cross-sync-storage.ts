'use client'

import { useEffect } from 'react'
import { GoalStorageService } from '@/lib/services/goal-storage-service'
import type { Goal } from '@/lib/models/goal'

interface UseGoalCrossSyncStorageOptions {
  onGoalsChange: (goals: Goal[]) => void
}

/**
 * useGoalCrossSyncStorage: React hook for cross-tab synchronization
 * Listens to storage events (from other tabs) and custom events (from same tab)
 * Triggers onGoalsChange callback when goals are updated in any tab
 * @param options Configuration { onGoalsChange }
 */
export function useGoalCrossSyncStorage({
  onGoalsChange,
}: UseGoalCrossSyncStorageOptions) {
  useEffect(() => {
    // Subscribe to storage changes and custom events
    const unsubscribe = GoalStorageService.onStorageChange((goals) => {
      onGoalsChange(goals)
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [onGoalsChange])
}
