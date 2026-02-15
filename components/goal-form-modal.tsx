'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GoalForm } from './goal-form'

interface GoalFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (title: string, endDate: string) => void
}

export function GoalFormModal({
  open,
  onOpenChange,
  onSubmit,
}: GoalFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <GoalForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
