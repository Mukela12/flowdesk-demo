import type {
  StudentDashboardData,
  StudentProfile,
  SemesterInfo,
  QuickAction,
  EnrolledCourse,
  ScheduleEntry,
  GpaTrend,
  AttendanceData,
  CreditDistribution,
  CourseMaterial,
} from './types'

// ── Student Profile ──
export const studentProfile: StudentProfile = {
  firstName: 'Mukela',
  lastName: 'Katungu',
  studentId: '2024/BSC/0142',
  program: 'BSc Computer Science',
  school: 'School of Engineering',
  year: 2,
  semester: 2,
  avatarInitials: 'MK',
  email: 'mukela.katungu@student.unza.zm',
}

// ── Semester Info ──
export const semesterInfo: SemesterInfo = {
  name: 'Year 2, Semester 2',
  startDate: '2026-01-13',
  endDate: '2026-05-16',
  currentWeek: 6,
  totalWeeks: 18,
}

// ── Quick Actions ──
export const quickActions: QuickAction[] = [
  { id: 'pay', label: 'Pay Fees', description: 'Outstanding: K4,500', variant: 'danger' },
  { id: 'transcript', label: 'View Transcript', description: 'Academic record', variant: 'secondary' },
  { id: 'register', label: 'Course Registration', description: 'Opens Mar 1', variant: 'primary' },
  { id: 'advisor', label: 'Contact Advisor', description: 'Dr. K. Mulenga', variant: 'secondary' },
]

// ── Course accent colors ──
const courseColors = {
  CS201: '#6C63FF',
  MATH301: '#10B981',
  ENG202: '#F59E0B',
  PHY101: '#F43F5E',
  BUS150: '#8B5CF6',
  STAT200: '#06B6D4',
}

// ── Full schedule for the week ──
export const weeklySchedule: ScheduleEntry[] = [
  // Monday
  { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', lecturerName: 'Dr. Mwansa', day: 'Monday', startTime: '08:00', endTime: '10:00', room: 'LT-1', building: 'School of Engineering', type: 'lecture' },
  { courseCode: 'MATH301', courseName: 'Linear Algebra', lecturerName: 'Prof. Tembo', day: 'Monday', startTime: '10:00', endTime: '12:00', room: 'LT-3', building: 'School of Natural Sciences', type: 'lecture' },
  { courseCode: 'ENG202', courseName: 'Technical Writing', lecturerName: 'Mrs. Banda', day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'SR-5', building: 'School of Humanities', type: 'tutorial' },
  // Tuesday
  { courseCode: 'PHY101', courseName: 'Physics for Engineers', lecturerName: 'Dr. Phiri', day: 'Tuesday', startTime: '08:00', endTime: '10:00', room: 'Lab-2', building: 'School of Natural Sciences', type: 'lab' },
  { courseCode: 'BUS150', courseName: 'Intro to Business', lecturerName: 'Mr. Zulu', day: 'Tuesday', startTime: '12:00', endTime: '14:00', room: 'LT-5', building: 'School of Business', type: 'lecture' },
  { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', lecturerName: 'Dr. Mwansa', day: 'Tuesday', startTime: '14:00', endTime: '16:00', room: 'Lab-1', building: 'School of Engineering', type: 'lab' },
  // Wednesday
  { courseCode: 'STAT200', courseName: 'Probability & Statistics', lecturerName: 'Dr. Mumba', day: 'Wednesday', startTime: '08:00', endTime: '10:00', room: 'LT-2', building: 'School of Natural Sciences', type: 'lecture' },
  { courseCode: 'MATH301', courseName: 'Linear Algebra', lecturerName: 'Prof. Tembo', day: 'Wednesday', startTime: '10:00', endTime: '12:00', room: 'SR-3', building: 'School of Natural Sciences', type: 'tutorial' },
  { courseCode: 'ENG202', courseName: 'Technical Writing', lecturerName: 'Mrs. Banda', day: 'Wednesday', startTime: '14:00', endTime: '16:00', room: 'SR-5', building: 'School of Humanities', type: 'lecture' },
  // Thursday
  { courseCode: 'PHY101', courseName: 'Physics for Engineers', lecturerName: 'Dr. Phiri', day: 'Thursday', startTime: '08:00', endTime: '10:00', room: 'LT-4', building: 'School of Natural Sciences', type: 'lecture' },
  { courseCode: 'BUS150', courseName: 'Intro to Business', lecturerName: 'Mr. Zulu', day: 'Thursday', startTime: '10:00', endTime: '12:00', room: 'SR-8', building: 'School of Business', type: 'tutorial' },
  { courseCode: 'STAT200', courseName: 'Probability & Statistics', lecturerName: 'Dr. Mumba', day: 'Thursday', startTime: '14:00', endTime: '16:00', room: 'Lab-3', building: 'School of Natural Sciences', type: 'lab' },
  // Friday
  { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', lecturerName: 'Dr. Mwansa', day: 'Friday', startTime: '08:00', endTime: '10:00', room: 'LT-1', building: 'School of Engineering', type: 'lecture' },
  { courseCode: 'MATH301', courseName: 'Linear Algebra', lecturerName: 'Prof. Tembo', day: 'Friday', startTime: '10:00', endTime: '12:00', room: 'LT-3', building: 'School of Natural Sciences', type: 'lecture' },
]

// ── Dashboard data (today = Monday for demo purposes) ──
export const dashboardData: StudentDashboardData = {
  stats: {
    enrolledCourses: 6,
    creditHours: 18,
    todayClasses: 3,
    attendanceRate: 87,
    absences: 4,
    gpa: 3.42,
    feeBalance: 4500,
    feeDueDate: '2026-03-15',
  },
  todaySchedule: weeklySchedule.filter((e) => e.day === 'Monday'),
  notifications: [
    { id: '1', title: 'Assignment Due Tomorrow', message: 'CS201 Binary Trees assignment due tomorrow at 11:59 PM', time: '2 hours ago', isNew: true, type: 'warning', category: 'academic', actionLabel: 'Submit Now' },
    { id: '2', title: 'Exam Schedule Published', message: 'Mid-semester exam timetable is now available for download', time: '5 hours ago', isNew: true, type: 'info', category: 'academic', actionLabel: 'View Schedule' },
    { id: '3', title: 'Fee Payment Overdue', message: 'Outstanding balance of K4,500. Payment deadline: March 15', time: '1 day ago', isNew: true, type: 'error', category: 'financial', actionLabel: 'Pay Now' },
    { id: '4', title: 'MATH301 Room Change', message: 'Wednesday Linear Algebra moved to LT-6 due to maintenance', time: '1 day ago', isNew: false, type: 'info', category: 'academic' },
    { id: '5', title: 'Lab Report Graded', message: 'PHY101 lab report graded. Score: 82/100', time: '2 days ago', isNew: false, type: 'success', category: 'academic', actionLabel: 'View Grade' },
    { id: '6', title: 'Library Hours Extended', message: 'Library hours extended to 10 PM during exam period', time: '3 days ago', isNew: false, type: 'info', category: 'general' },
    { id: '7', title: 'Course Registration Opens', message: 'Registration for next semester opens March 1', time: '4 days ago', isNew: false, type: 'info', category: 'academic', actionLabel: 'Set Reminder' },
  ],
}

// ── Enrolled courses ──
export const enrolledCourses: EnrolledCourse[] = [
  {
    id: 'cs201', code: 'CS201', name: 'Data Structures & Algorithms', lecturerName: 'Dr. Mwansa',
    credits: 4, enrolled: 38, capacity: 45, color: courseColors.CS201,
    currentGrade: 'B+', nextClass: 'Mon 08:00',
    schedule: [
      { day: 'Monday', startTime: '08:00', endTime: '10:00', room: 'LT-1' },
      { day: 'Tuesday', startTime: '14:00', endTime: '16:00', room: 'Lab-1' },
      { day: 'Friday', startTime: '08:00', endTime: '10:00', room: 'LT-1' },
    ],
    assignments: [
      { id: 'a1', title: 'Binary Trees Implementation', dueDate: '2026-02-21', status: 'pending', weight: 15 },
      { id: 'a2', title: 'Sorting Algorithms Analysis', dueDate: '2026-03-05', status: 'pending', weight: 20 },
      { id: 'a3', title: 'Linked Lists Lab', dueDate: '2026-02-10', status: 'graded', grade: 88, maxGrade: 100, weight: 10 },
    ],
  },
  {
    id: 'math301', code: 'MATH301', name: 'Linear Algebra', lecturerName: 'Prof. Tembo',
    credits: 3, enrolled: 52, capacity: 60, color: courseColors.MATH301,
    currentGrade: 'A-', nextClass: 'Mon 10:00',
    schedule: [
      { day: 'Monday', startTime: '10:00', endTime: '12:00', room: 'LT-3' },
      { day: 'Wednesday', startTime: '10:00', endTime: '12:00', room: 'SR-3' },
      { day: 'Friday', startTime: '10:00', endTime: '12:00', room: 'LT-3' },
    ],
    assignments: [
      { id: 'a4', title: 'Eigenvalues Problem Set', dueDate: '2026-02-28', status: 'pending', weight: 15 },
      { id: 'a5', title: 'Matrix Operations Quiz', dueDate: '2026-02-14', status: 'graded', grade: 92, maxGrade: 100, weight: 10 },
    ],
  },
  {
    id: 'eng202', code: 'ENG202', name: 'Technical Writing', lecturerName: 'Mrs. Banda',
    credits: 2, enrolled: 30, capacity: 35, color: courseColors.ENG202,
    currentGrade: 'B', nextClass: 'Mon 14:00',
    schedule: [
      { day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'SR-5' },
      { day: 'Wednesday', startTime: '14:00', endTime: '16:00', room: 'SR-5' },
    ],
    assignments: [
      { id: 'a6', title: 'Research Proposal Draft', dueDate: '2026-03-01', status: 'pending', weight: 25 },
      { id: 'a7', title: 'Citation Exercise', dueDate: '2026-02-12', status: 'submitted', weight: 5 },
    ],
  },
  {
    id: 'phy101', code: 'PHY101', name: 'Physics for Engineers', lecturerName: 'Dr. Phiri',
    credits: 4, enrolled: 42, capacity: 50, color: courseColors.PHY101,
    currentGrade: 'B+', nextClass: 'Tue 08:00',
    schedule: [
      { day: 'Tuesday', startTime: '08:00', endTime: '10:00', room: 'Lab-2' },
      { day: 'Thursday', startTime: '08:00', endTime: '10:00', room: 'LT-4' },
    ],
    assignments: [
      { id: 'a8', title: 'Mechanics Lab Report', dueDate: '2026-02-18', status: 'graded', grade: 82, maxGrade: 100, weight: 15 },
      { id: 'a9', title: 'Thermodynamics Problem Set', dueDate: '2026-03-10', status: 'pending', weight: 20 },
    ],
  },
  {
    id: 'bus150', code: 'BUS150', name: 'Intro to Business', lecturerName: 'Mr. Zulu',
    credits: 3, enrolled: 65, capacity: 80, color: courseColors.BUS150,
    currentGrade: 'A', nextClass: 'Tue 12:00',
    schedule: [
      { day: 'Tuesday', startTime: '12:00', endTime: '14:00', room: 'LT-5' },
      { day: 'Thursday', startTime: '10:00', endTime: '12:00', room: 'SR-8' },
    ],
    assignments: [
      { id: 'a10', title: 'Business Plan Outline', dueDate: '2026-03-08', status: 'pending', weight: 30 },
    ],
  },
  {
    id: 'stat200', code: 'STAT200', name: 'Probability & Statistics', lecturerName: 'Dr. Mumba',
    credits: 2, enrolled: 28, capacity: 40, color: courseColors.STAT200,
    currentGrade: 'B+', nextClass: 'Wed 08:00',
    schedule: [
      { day: 'Wednesday', startTime: '08:00', endTime: '10:00', room: 'LT-2' },
      { day: 'Thursday', startTime: '14:00', endTime: '16:00', room: 'Lab-3' },
    ],
    assignments: [
      { id: 'a11', title: 'Hypothesis Testing Exercise', dueDate: '2026-02-25', status: 'pending', weight: 15 },
      { id: 'a12', title: 'Probability Distributions Quiz', dueDate: '2026-02-08', status: 'graded', grade: 78, maxGrade: 100, weight: 10 },
    ],
  },
]

// ── Chart data ──
export const gpaTrend: GpaTrend[] = [
  { semester: 'Y1 S1', gpa: 2.85 },
  { semester: 'Y1 S2', gpa: 3.10 },
  { semester: 'Y2 S1', gpa: 3.25 },
  { semester: 'Y2 S2', gpa: 3.42 },
]

export const attendanceData: AttendanceData[] = [
  { month: 'Sep', present: 20, absent: 2 },
  { month: 'Oct', present: 18, absent: 4 },
  { month: 'Nov', present: 21, absent: 1 },
  { month: 'Dec', present: 15, absent: 3 },
  { month: 'Jan', present: 19, absent: 2 },
  { month: 'Feb', present: 12, absent: 1 },
]

export const creditDistribution: CreditDistribution[] = [
  { category: 'Core CS', credits: 6, color: '#6C63FF' },
  { category: 'Mathematics', credits: 5, color: '#10B981' },
  { category: 'Sciences', credits: 4, color: '#F43F5E' },
  { category: 'Humanities', credits: 2, color: '#F59E0B' },
  { category: 'Electives', credits: 1, color: '#8B5CF6' },
]

// ── Course Materials ──
export const courseMaterials: CourseMaterial[] = [
  // CS201
  { id: 'm1', courseId: 'cs201', title: 'Lecture 1: Introduction to Trees', type: 'slides', url: '#', size: '2.4 MB', uploadedAt: '2026-01-20' },
  { id: 'm2', courseId: 'cs201', title: 'Lab Guide: Binary Tree Implementation', type: 'pdf', url: '#', size: '1.1 MB', uploadedAt: '2026-01-27' },
  { id: 'm3', courseId: 'cs201', title: 'Sorting Algorithms Visualized', type: 'video', url: '#', size: '48 MB', uploadedAt: '2026-02-03' },
  { id: 'm4', courseId: 'cs201', title: 'Graph Traversal Cheat Sheet', type: 'pdf', url: '#', size: '320 KB', uploadedAt: '2026-02-10' },
  // MATH301
  { id: 'm5', courseId: 'math301', title: 'Chapter 4: Eigenvalues & Eigenvectors', type: 'slides', url: '#', size: '3.8 MB', uploadedAt: '2026-01-22' },
  { id: 'm6', courseId: 'math301', title: 'Matrix Operations Practice Problems', type: 'pdf', url: '#', size: '890 KB', uploadedAt: '2026-02-01' },
  { id: 'm7', courseId: 'math301', title: 'Linear Transformations Video Lecture', type: 'video', url: '#', size: '62 MB', uploadedAt: '2026-02-08' },
  // ENG202
  { id: 'm8', courseId: 'eng202', title: 'APA Citation Guide (7th Edition)', type: 'pdf', url: '#', size: '1.5 MB', uploadedAt: '2026-01-18' },
  { id: 'm9', courseId: 'eng202', title: 'Research Proposal Template', type: 'pdf', url: '#', size: '240 KB', uploadedAt: '2026-01-25' },
  { id: 'm10', courseId: 'eng202', title: 'Technical Writing Examples', type: 'link', url: '#', uploadedAt: '2026-02-05' },
  // PHY101
  { id: 'm11', courseId: 'phy101', title: 'Mechanics Lecture Slides Week 1-4', type: 'slides', url: '#', size: '5.2 MB', uploadedAt: '2026-01-20' },
  { id: 'm12', courseId: 'phy101', title: 'Lab Safety Manual', type: 'pdf', url: '#', size: '1.8 MB', uploadedAt: '2026-01-15' },
  { id: 'm13', courseId: 'phy101', title: 'Thermodynamics Introduction', type: 'video', url: '#', size: '55 MB', uploadedAt: '2026-02-12' },
  // BUS150
  { id: 'm14', courseId: 'bus150', title: 'Business Plan Framework', type: 'slides', url: '#', size: '2.1 MB', uploadedAt: '2026-01-22' },
  { id: 'm15', courseId: 'bus150', title: 'Case Study: Startup Valuation', type: 'pdf', url: '#', size: '680 KB', uploadedAt: '2026-02-06' },
  // STAT200
  { id: 'm16', courseId: 'stat200', title: 'Probability Distributions Handbook', type: 'pdf', url: '#', size: '1.3 MB', uploadedAt: '2026-01-21' },
  { id: 'm17', courseId: 'stat200', title: 'Hypothesis Testing Workshop', type: 'video', url: '#', size: '42 MB', uploadedAt: '2026-02-09' },
  { id: 'm18', courseId: 'stat200', title: 'R Studio Quick Reference', type: 'link', url: '#', uploadedAt: '2026-02-14' },
]
