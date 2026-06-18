export interface Email {
  id: string
  initials?: string
  sender: string
  time: string
  subject: string
  snippet: string
  unread?: boolean
  isCalendar?: boolean
}

export interface ScheduleEvent {
  time: string
  end: string
  title: string
  color: string
  initials: string
  conflict?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  description?: string
  meetingLink?: string
  calendar?: string
}
