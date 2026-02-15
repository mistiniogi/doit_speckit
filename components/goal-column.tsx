'use client'

import { useState, useRef, useEffect } from 'react'
import type { Goal, GoalStatus, GoalWithComputed } from '@/lib/models/goal'
import { GoalCard } from './goal-card'
import { useSortableGoals } from '@/hooks/use-sortable-goals'

interface GoalColumnProps {
  title: string
  goals: GoalWithComputed[]
  status: GoalStatus
  emptyMessage: string
  onComplete: (goalId: string) => void
  onDelete: (goalId: string) => void
  onReorder: (goals: Goal[]) => void
}

export function GoalColumn({
  title,
  goals,
  status,
  emptyMessage,
  onComplete,
  onDelete,
  onReorder,
}: GoalColumnProps) {
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { sortableRef, isDragging, draggedGoalId } = useSortableGoals({
    status,
    goals,
    onReorder,
  })

  // Auto-scroll implementation (T018a, T018b)
  useEffect(() => {
    if (!isDragging || !containerRef.current) {
      setAutoScrollSpeed(0)
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
      return
    }

    const container = containerRef.current
    const EDGE_THRESHOLD = 50 // pixels from edge to trigger scroll
    const BASE_SPEED = 10 // px per 100ms
    const MAX_SPEED = 20 // max px per 100ms

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const distFromTop = e.clientY - rect.top
      const distFromBottom = rect.bottom - e.clientY

      let speed = 0

      // Near top edge
      if (distFromTop < EDGE_THRESHOLD && distFromTop > 0) {
        speed = -(BASE_SPEED + (MAX_SPEED - BASE_SPEED) * (1 - distFromTop / EDGE_THRESHOLD))
      }
      // Near bottom edge
      else if (distFromBottom < EDGE_THRESHOLD && distFromBottom > 0) {
        speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * (1 - distFromBottom / EDGE_THRESHOLD)
      }

      setAutoScrollSpeed(speed)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging])

  // Apply auto-scroll
  useEffect(() => {
    if (autoScrollSpeed === 0 || !containerRef.current) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
      return
    }

    autoScrollRef.current = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop += autoScrollSpeed
      }
    }, 100)

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [autoScrollSpeed])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title} ({goals.length})
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 min-h-[200px] overflow-y-auto rounded-lg bg-white border border-gray-200">
        {goals.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <ul ref={sortableRef} className="goal-list p-3">
            {goals.map((goal) => (
              <li 
                key={goal.id} 
                data-id={goal.id} 
                className="transition-opacity goal-item"
              >
                <GoalCard
                  goal={goal}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  isDragging={draggedGoalId === goal.id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
