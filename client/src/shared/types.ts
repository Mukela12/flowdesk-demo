// ── Student Profile ──
export interface StudentProfile {
  firstName: string
  lastName: string
  studentId: string
  program: string
  school: string
  year: number
  semester: number
  avatarInitials: string
  email: string
}

// ── Dashboard Stats ──
export interface StudentDashboardStats {
  enrolledCourses: number
  creditHours: number
  todayClasses: number
  attendanceRate: number
  absences: number
  gpa: number
  feeBalance: number
  feeDueDate: string
}

// ── Notifications ──
export interface DashboardNotification {
  id: string
  title: string
  message: string
  time: string
  isNew: boolean
  type: 'info' | 'warning' | 'success' | 'error'
  category: 'academic' | 'financial' | 'general'
  actionLabel?: string
  actionHref?: string
}

// ── Dashboard Aggregate ──
export interface StudentDashboardData {
  stats: StudentDashboardStats
  todaySchedule: ScheduleEntry[]
  notifications: DashboardNotification[]
}

// ── Schedule ──
export interface ScheduleEntry {
  courseCode: string
  courseName: string
  lecturerName: string
  day: string
  startTime: string
  endTime: string
  room: string
  building: string
  type: 'lecture' | 'lab' | 'tutorial'
}

// ── Courses ──
export interface CourseAssignment {
  id: string
  title: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: number
  maxGrade?: number
  weight?: number
}

export interface EnrolledCourse {
  id: string
  code: string
  name: string
  lecturerName: string
  credits: number
  enrolled: number
  capacity: number
  color: string
  schedule: { day: string; startTime: string; endTime: string; room: string }[]
  assignments: CourseAssignment[]
  currentGrade?: string
  nextClass?: string
}

// ── Upcoming Deadlines (computed from courses) ──
export interface UpcomingDeadline {
  courseCode: string
  courseColor: string
  title: string
  dueDate: string
  daysRemaining: number
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
}

// ── Semester Info ──
export interface SemesterInfo {
  name: string
  startDate: string
  endDate: string
  currentWeek: number
  totalWeeks: number
}

// ── Quick Actions ──
export interface QuickAction {
  id: string
  label: string
  description: string
  variant: 'primary' | 'secondary' | 'danger'
}

// ── Chart Data ──
export interface GpaTrend {
  semester: string
  gpa: number
}

export interface AttendanceData {
  month: string
  present: number
  absent: number
}

export interface CreditDistribution {
  category: string
  credits: number
  color: string
}

// ── Course Materials ──
export interface CourseMaterial {
  id: string
  courseId: string
  title: string
  type: 'pdf' | 'video' | 'slides' | 'link'
  url: string
  size?: string
  uploadedAt: string
}

// ── Assignment Submissions ──
export interface AssignmentSubmission {
  assignmentId: string
  courseId: string
  text: string
  fileName?: string
  submittedAt: string
}

// ── Student Notes ──
export interface StudentNote {
  id: string
  courseId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// ── Calendar Events ──
export interface CalendarEvent {
  id: string
  title: string
  type: 'class' | 'deadline' | 'exam'
  courseCode: string
  courseColor: string
  date: string
  time?: string
  room?: string
}

// ── Toast ──
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
