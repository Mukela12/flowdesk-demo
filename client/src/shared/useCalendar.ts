import { useState, useMemo } from 'react'
import type { CalendarEvent } from './types'
import { weeklySchedule, enrolledCourses } from './data'

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
}

function buildCalendarEvents(year: number, month: number): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const daysInMonth = getDaysInMonth(year, month)
  const courseColorMap: Record<string, string> = {}
  for (const c of enrolledCourses) {
    courseColorMap[c.code] = c.color
  }

  // Weekly schedule → recurring class events for each matching weekday in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    for (const entry of weeklySchedule) {
      if (DAY_MAP[entry.day] === dayOfWeek) {
        events.push({
          id: `class-${dateStr}-${entry.courseCode}-${entry.startTime}`,
          title: `${entry.courseCode} ${entry.type}`,
          type: 'class',
          courseCode: entry.courseCode,
          courseColor: courseColorMap[entry.courseCode] || '#888',
          date: dateStr,
          time: entry.startTime,
          room: entry.room,
        })
      }
    }
  }

  // Assignment deadlines
  for (const course of enrolledCourses) {
    for (const a of course.assignments) {
      const d = new Date(a.dueDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        events.push({
          id: `deadline-${a.id}`,
          title: `${course.code}: ${a.title}`,
          type: 'deadline',
          courseCode: course.code,
          courseColor: course.color,
          date: a.dueDate,
        })
      }
    }
  }

  return events
}

export function useCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfMonth(year, month)
  const monthName = MONTH_NAMES[month]

  const events = useMemo(() => buildCalendarEvents(year, month), [year, month])

  const eventsForDay = (day: number): CalendarEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter((e) => e.date === dateStr)
  }

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  return {
    year,
    month,
    monthName,
    daysInMonth,
    firstDayOffset,
    events,
    eventsForDay,
    goToPrevMonth,
    goToNextMonth,
    isToday,
  }
}
