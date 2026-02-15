import {
  differenceInDays,
  format,
  isToday,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns'

/**
 * DateService: Wrapper around date-fns for goal-related date calculations
 */
export class DateService {
  /**
   * Get number of days remaining from today until the given date (inclusive)
   * @param endDate ISO date string (YYYY-MM-DD)
   * @returns Number of days remaining (negative if past date)
   */
  static getDaysRemaining(endDate: string): number {
    try {
      const today = startOfDay(new Date())
      const end = startOfDay(parseISO(endDate))
      return differenceInDays(end, today)
    } catch {
      return -1
    }
  }

  /**
   * Check if goal is urgent (0-3 days remaining)
   * @param endDate ISO date string (YYYY-MM-DD)
   * @returns True if days remaining is 0-3
   */
  static isUrgent(endDate: string): boolean {
    const daysRemaining = this.getDaysRemaining(endDate)
    return daysRemaining >= 0 && daysRemaining <= 3
  }

  /**
   * Format date for display (e.g., "Feb 15, 2026")
   * @param dateString ISO date string or ISO timestamp
   * @returns Formatted date string
   */
  static formatDate(dateString: string): string {
    try {
      const date = parseISO(dateString.split('T')[0]) // Extract just the date part if it's a timestamp
      return format(date, 'MMM d, yyyy')
    } catch {
      return ''
    }
  }

  /**
   * Get today's date in ISO format (YYYY-MM-DD)
   * @returns ISO date string
   */
  static getTodayISO(): string {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  /**
   * Get current ISO timestamp
   * @returns ISO timestamp string
   */
  static getNowISO(): string {
    return new Date().toISOString()
  }

  /**
   * Format days remaining as human-readable string
   * @param endDate ISO date string (YYYY-MM-DD)
   * @returns String like "5 days left" or "Today" or "Overdue"
   */
  static formatDaysRemaining(endDate: string): string {
    const daysRemaining = this.getDaysRemaining(endDate)

    if (daysRemaining < 0) {
      return 'Overdue'
    } else if (daysRemaining === 0) {
      return 'Today'
    } else if (daysRemaining === 1) {
      return '1 day left'
    } else {
      return `${daysRemaining} days left`
    }
  }

  /**
   * Validate that a date string is in valid ISO format and is today or future
   * @param dateString ISO date string (YYYY-MM-DD)
   * @returns { valid: boolean, error?: string }
   */
  static validateFutureDate(dateString: string): {
    valid: boolean
    error?: string
  } {
    try {
      const parsed = parseISO(dateString)
      if (isNaN(parsed.getTime())) {
        return { valid: false, error: 'Invalid date format' }
      }

      const today = startOfDay(new Date())
      const chosen = startOfDay(parsed)

      if (chosen < today) {
        return { valid: false, error: 'End date must be today or in the future' }
      }

      return { valid: true }
    } catch {
      return { valid: false, error: 'Invalid date format' }
    }
  }
}
