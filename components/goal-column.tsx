'use client'

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
  const { sortableRef, isDragging, draggedGoalId } = useSortableGoals({
    status,
    goals,
    onReorder,
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title} ({goals.length})
        </h2>
      </div>

      <div className="flex-1 min-h-[200px] overflow-y-auto">
        {goals.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <ul ref={sortableRef} className="space-y-3 list-none">
            {goals.map((goal) => (
              <li key={goal.id} data-id={goal.id} className="transition-opacity">
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
