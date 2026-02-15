'use client'

import { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import type { GoalStatus } from '@/lib/models/goal'
import { GoalOrderService } from '@/lib/services/goal-order-service'
import { GoalStorageService } from '@/lib/services/goal-storage-service'

interface UseSortableGoalsOptions {
  status: GoalStatus
  goals: any[]
  onReorder: (reorderedGoals: any[]) => void
}

/**
 * useSortableGoals: React hook for Sortable.js integration
 * Initializes Sortable instance, manages drag state, handles reordering
 * Ensure goal items are keyboard-accessible (focusable via Tab)
 * @param options Configuration { status, goals, onReorder }
 * @returns { sortableRef, isDragging, draggedGoalId }
 */
export function useSortableGoals({
  status,
  goals,
  onReorder,
}: UseSortableGoalsOptions) {
  const sortableRef = useRef<HTMLUListElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedGoalId, setDraggedGoalId] = useState<string | null>(null)
  const sortableInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!sortableRef.current) return

    // Initialize Sortable.js
    sortableInstanceRef.current = Sortable.create(sortableRef.current, {
      group: `goals-${status}`, // Allow within-column drag only
      animation: 200,
      ghostClass: 'opacity-50',
      dragClass: 'opacity-50',
      // No handle restriction - allow dragging from entire card except filtered elements
      filter: 'button,input,[data-no-drag]', // Don't drag from buttons, inputs, or marked elements
      forceFallback: false, // Use native drag when possible
      dataIdAttr: 'data-id',

      onStart: (event) => {
        setIsDragging(true)
        setDraggedGoalId(event.item.getAttribute('data-id'))
      },

      onEnd: (event) => {
        const goalId = event.item.getAttribute('data-id')
        if (!goalId) {
          setIsDragging(false)
          setDraggedGoalId(null)
          return
        }

        // Get new order based on DOM position
        const newIndex = event.newIndex || 0

        try {
          // Reorder goals using service
          const allGoals = GoalStorageService.loadGoals()
          const reorderedGoals = GoalOrderService.reorderGoalsInColumn(
            allGoals,
            goalId,
            newIndex,
            status
          )

          // Persist and call parent callback
          GoalStorageService.saveGoals(reorderedGoals)
          onReorder(reorderedGoals)
        } catch (error) {
          console.error('Reordering failed:', error)
          // Revert by reloading
          onReorder(GoalStorageService.loadGoals())
        } finally {
          setIsDragging(false)
          setDraggedGoalId(null)
        }
      },

      onMove: (event) => {
        // Allow move within same column
        return true
      },
    })

    // Make goal items keyboard-accessible (T025)
    // Goal items (li) are focusable via Tab key for keyboard navigation
    // Users can Tab through goals to focus them
    const makeAccessible = () => {
      if (!sortableRef.current) return
      
      sortableRef.current.querySelectorAll('li[data-id]').forEach((item) => {
        // Ensure each goal item is focusable (tab-accessible)
        if (!item.getAttribute('tabindex')) {
          item.setAttribute('tabindex', '0')
        }
      })
    }

    makeAccessible()

    // Cleanup on unmount
    return () => {
      if (sortableInstanceRef.current) {
        sortableInstanceRef.current.destroy()
        sortableInstanceRef.current = null
      }
    }
  }, [status, onReorder])

  return { sortableRef, isDragging, draggedGoalId }
}
