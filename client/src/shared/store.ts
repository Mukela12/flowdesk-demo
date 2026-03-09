import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssignmentSubmission, StudentNote, Toast } from './types'

interface PortalState {
  // Submissions
  submissions: Record<string, AssignmentSubmission>
  submitAssignment: (submission: AssignmentSubmission) => void

  // Notes
  notes: StudentNote[]
  addNote: (note: StudentNote) => void
  updateNote: (id: string, updates: Partial<Pick<StudentNote, 'title' | 'content' | 'updatedAt'>>) => void
  deleteNote: (id: string) => void

  // Notifications
  dismissedNotificationIds: string[]
  dismissNotification: (id: string) => void

  // Toasts
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void

  // Calendar
  selectedDate: string | null
  setSelectedDate: (date: string | null) => void
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      // Submissions
      submissions: {},
      submitAssignment: (submission) =>
        set((s) => ({
          submissions: { ...s.submissions, [submission.assignmentId]: submission },
        })),

      // Notes
      notes: [],
      addNote: (note) =>
        set((s) => ({ notes: [note, ...s.notes] })),
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),
      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // Notifications
      dismissedNotificationIds: [],
      dismissNotification: (id) =>
        set((s) => ({
          dismissedNotificationIds: [...s.dismissedNotificationIds, id],
        })),

      // Toasts (not persisted — handled via partialize)
      toasts: [],
      addToast: (toast) =>
        set((s) => ({ toasts: [...s.toasts, toast] })),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // Calendar
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'student-portal',
      partialize: (state) => ({
        submissions: state.submissions,
        notes: state.notes,
        dismissedNotificationIds: state.dismissedNotificationIds,
      }),
    }
  )
)
