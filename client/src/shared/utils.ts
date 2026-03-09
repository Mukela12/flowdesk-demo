import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ScheduleEntry, EnrolledCourse, UpcomingDeadline } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `K${amount.toLocaleString('en-US')}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-ZM', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
}

export function getGreeting(firstName?: string): string {
  const hour = new Date().getHours()
  let greeting: string
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'
  else greeting = 'Good evening'
  return firstName ? `${greeting}, ${firstName}` : greeting
}

export function getCurrentDay(): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
}

export function groupByDay(entries: ScheduleEntry[]): Record<string, ScheduleEntry[]> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const grouped: Record<string, ScheduleEntry[]> = {}
  for (const day of days) {
    const dayEntries = entries.filter((e) => e.day === day)
    if (dayEntries.length > 0) {
      grouped[day] = dayEntries.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
  }
  return grouped
}

// ── Student Portal Specific Utils ──

/** Get days remaining until a date. Negative = overdue */
export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  target.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/** Format a date as "Tomorrow", "In 3 days", "Mar 15", or "Overdue" */
export function formatRelativeDate(dateStr: string): string {
  const days = getDaysUntil(dateStr)
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days <= 7) return `In ${days} days`
  return formatShortDate(dateStr)
}

/** Get urgency level from days remaining */
export function getUrgencyLevel(daysRemaining: number): 'critical' | 'warning' | 'normal' {
  if (daysRemaining <= 1) return 'critical'
  if (daysRemaining <= 3) return 'warning'
  return 'normal'
}

/** Convert 24h time string to 12h display */
export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

/** Get upcoming deadlines sorted by date, with days remaining */
export function getUpcomingDeadlines(courses: EnrolledCourse[]): UpcomingDeadline[] {
  const deadlines: UpcomingDeadline[] = []

  for (const course of courses) {
    for (const a of course.assignments) {
      if (a.status === 'pending' || a.status === 'overdue') {
        deadlines.push({
          courseCode: course.code,
          courseColor: course.color,
          title: a.title,
          dueDate: a.dueDate,
          daysRemaining: getDaysUntil(a.dueDate),
          status: getDaysUntil(a.dueDate) < 0 ? 'overdue' : a.status,
        })
      }
    }
  }

  return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining)
}

/** Get next class from today's schedule */
export function getNextClass(schedule: ScheduleEntry[]): ScheduleEntry | null {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const entry of schedule) {
    const [h, m] = entry.startTime.split(':').map(Number)
    if (h * 60 + m > currentMinutes) {
      return entry
    }
  }

  return schedule.length > 0 ? schedule[0] : null
}

/** Calculate semester progress as percentage */
export function getSemesterProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  const pct = ((now - start) / (end - start)) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
}

/** Convert time string to grid row position for timetable (8:00 = row 1, each row = 30 min) */
export function timeToGridRow(time: string, startHour: number = 8): number {
  const [h, m] = time.split(':').map(Number)
  return ((h - startHour) * 2) + (m >= 30 ? 1 : 0) + 1
}

/** Get duration in grid rows (each row = 30 min) */
export function durationToGridSpan(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMinutes = sh * 60 + sm
  const endMinutes = eh * 60 + em
  return Math.ceil((endMinutes - startMinutes) / 30)
}

/** Get today's date formatted nicely */
export function getTodayFormatted(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
}

/** Generate a simple unique id */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** Format file size for display */
export function formatFileSize(size?: string): string {
  return size || ''
}

/** Get icon label for material type */
export function getMaterialTypeLabel(type: 'pdf' | 'video' | 'slides' | 'link'): string {
  const labels: Record<string, string> = { pdf: 'PDF', video: 'Video', slides: 'Slides', link: 'Link' }
  return labels[type] || type
}
