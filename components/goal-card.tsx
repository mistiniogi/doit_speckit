'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { DeleteConfirmationModal } from './delete-confirmation-modal'
import type { GoalWithComputed } from '@/lib/models/goal'

interface GoalCardProps {
  goal: GoalWithComputed
  onComplete: (goalId: string) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onComplete, onDelete }: GoalCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const isCompleted = goal.status === 'completed'
  const bgColor = isCompleted ? 'bg-pastel-pink/20' : goal.isUrgent ? 'bg-pastel-purple' : 'bg-white'

  const handleDeleteConfirm = () => {
    onDelete(goal.id)
  }

  return (
    <>
      <Card className={`${bgColor} p-4 border border-gray-200 rounded-lg`}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-base font-semibold flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {goal.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onComplete(goal.id)}
              id={`goal-${goal.id}`}
              className="h-5 w-5"
            />
            <label htmlFor={`goal-${goal.id}`} className="text-sm text-gray-600 cursor-pointer flex-1">
              {isCompleted && goal.completedDateFormatted ? (
                <span>Completed on {goal.completedDateFormatted}</span>
              ) : (
                <span>{goal.daysRemainingText}</span>
              )}
            </label>
          </div>

          {!isCompleted && (
            <p className="text-xs text-gray-500">
              Due: {goal.endDateFormatted}
            </p>
          )}
        </div>
      </Card>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        goalTitle={goal.title}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
