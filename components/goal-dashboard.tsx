'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGoals } from '@/hooks/use-goals'
import { useGoalCrossSyncStorage } from '@/hooks/use-goal-cross-sync-storage'
import { GoalColumn } from './goal-column'
import { GoalFormModal } from './goal-form-modal'
import type { Goal } from '@/lib/models/goal'

export function GoalDashboard() {
  const { activeGoals, completedGoals, completeGoal, deleteGoal, addGoal } = useGoals()
  const [showModal, setShowModal] = useState(false)

  // Handle reorder callback
  const handleReorder = (_reorderedGoals: Goal[]) => {
    // Reordering is handled by the storage service in the hook
    // Just trigger a refresh of goals from storage
  }

  // Subscribe to cross-tab changes
  useGoalCrossSyncStorage({
    onGoalsChange: () => {
      // Goals will be refreshed via the hook
    },
  })

  const handleAddGoal = (title: string, endDate: string) => {
    addGoal({ title, endDate })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">DoIt Goal Tracker</h1>
          <Button onClick={() => setShowModal(true)} className="bg-pastel-blue hover:bg-blue-300 text-gray-900">
            Add Goal
          </Button>
        </div>

        {/* Two-column layout for desktop, single column for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Goals Column */}
          <GoalColumn
            title="Current Goals"
            goals={activeGoals}
            status="active"
            emptyMessage="No goals yet. Click 'Add Goal' to get started!"
            onComplete={completeGoal}
            onDelete={deleteGoal}
            onReorder={handleReorder}
          />

          {/* Completed Goals Column */}
          <GoalColumn
            title="Completed"
            goals={completedGoals}
            status="completed"
            emptyMessage="Complete your first goal to see it here!"
            onComplete={completeGoal}
            onDelete={deleteGoal}
            onReorder={handleReorder}
          />
        </div>
      </div>

      {/* Add Goal Modal */}
      <GoalFormModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleAddGoal}
      />
    </div>
  )
}
