'use client'

import type { GoalWithComputed } from '@/lib/models/goal'
import { GoalCard } from './goal-card'

interface GoalColumnProps {
  title: string
  goals: GoalWithComputed[]
  emptyMessage: string
  onComplete: (goalId: string) => void
  onDelete: (goalId: string) => void
}

export function GoalColumn({
  title,
  goals,
  emptyMessage,
  onComplete,
  onDelete,
}: GoalColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title} ({goals.length})
        </h2>
      </div>

      <div className="flex-1 space-y-3 min-h-[200px] overflow-y-auto">
        {goals.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
