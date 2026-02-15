'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateService } from '@/lib/services/date-service'

interface GoalFormProps {
  onSubmit: (title: string, endDate: string) => void
  onCancel: () => void
}

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState<{ title?: string; endDate?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { title?: string; endDate?: string } = {}

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less'
    }

    // Validate endDate
    if (!endDate.trim()) {
      newErrors.endDate = 'End date is required'
    } else {
      const dateValidation = DateService.validateFutureDate(endDate)
      if (!dateValidation.valid) {
        newErrors.endDate = dateValidation.error
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(title, endDate)
      // Reset form
      setTitle('')
      setEndDate('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title"
          className="w-full"
          maxLength={100}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
          End Date *
        </label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full"
        />
        {errors.endDate && (
          <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-pastel-blue hover:bg-blue-300 text-gray-900">
          Create
        </Button>
      </div>
    </form>
  )
}
