"use client"
import { useEffect, useState } from 'react'
import { TopNav } from '../components/top-nav'
import { InboxPanel } from '../components/inbox-panel'
import { InboxPanelSkeleton } from '../components/inbox-panel-skeleton'
import { CommandPanel } from '../components/command-panel'
import { CalendarPanel } from '../components/calendar-panel'
import type { Email, ScheduleEvent, CalendarEvent } from '../components/types'

// const emails: Email[] = [
//   {
//     id: 1,
//     initials: "SJ",
//     name: "Sarah Jenkins",
//     time: "9:41 AM",
//     subject: "Project Update: Q3 Phase 1",
//     snippet: "Hi team, just wanted to check in on the progress ...",
//     unread: true,
//   },
//   {
//     id: 2,
//     initials: "WS",
//     name: "Weekly Sync",
//     time: "8:15 AM",
//     subject: "Meeting Agenda for Today",
//     snippet: "Please find the attached agenda for our afternoo...",
//     unread: true,
//   },
//   {
//     id: 3,
//     initials: "DL",
//     name: "Delta Airlines",
//     time: "Yesterday",
//     subject: "Flight Confirmation: NYC to SFO",
//     snippet: "Your booking reference is HJ98K2. Departure at 1...",
//     unread: false,
//   },
//   {
//     id: 4,
//     initials: "MA",
//     name: "Marcus Aurelius",
//     time: "Yesterday",
//     subject: "Design Review Feedback",
//     snippet: "I've gone through the latest wireframes and have ...",
//     unread: false,
//   },
//   {
//     id: 5,
//     initials: "SU",
//     name: "Substack",
//     time: "Yesterday",
//     subject: "Newsletter: The Friday Focus",
//     snippet: "The intersection of AI and craftsmanship in 2026...",
//     unread: false,
//   },
//   {
//     id: 6,
//     initials: "ST",
//     name: "Support Ticket",
//     time: "2d ago",
//     subject: "Re: Issue with Workspace Integration",
//     snippet: "Our technical team is currently investigating the i...",
//     unread: false,
//   },
// ]

export default function DashboardPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState< Email | undefined >(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    fetchEmails()
    fetchCalendar()
  }, [])

  const fetchEmails = async () => {
    const response = await fetch('/api/emails');
    const data = await response.json()
    setEmails(data?.emails)
    setSelectedEmail(data?.emails[0])
    setIsLoading(false)
  }

  const formatDisplayTime = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 || 12
    return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`
  }

  const detectConflicts = (events: ScheduleEvent[]) => {
    return events.map((e, i) => {
      const startMin = parseTime(events[i].time)
      const endMin = parseTime(events[i].end)
      const hasConflict = events.some((other, j) => {
        if (i === j) return false
        const otherStart = parseTime(other.time)
        const otherEnd = parseTime(other.end)
        return startMin < otherEnd && endMin > otherStart
      })
      return { ...e, conflict: hasConflict }
    })
  }

  const parseTime = (time: string) => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return 0
    let h = parseInt(match[1])
    const m = parseInt(match[2])
    const period = match[3].toUpperCase()
    if (period === "PM" && h !== 12) h += 12
    if (period === "AM" && h === 12) h = 0
    return h * 60 + m
  }

  const fetchCalendar = async () => {
    try {
      const response = await fetch('/api/calendar')
      const data = await response.json()
      setAllEvents(data?.events ?? [])
    } catch (err) {
      console.error("Failed to fetch calendar:", err)
    }
  }

  const schedule = (() => {
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const d = String(selectedDate.getDate()).padStart(2, "0")
    const dateStr = `${y}-${m}-${d}`
    const dayEvents = allEvents
      .filter((e) => e.date === dateStr)
      .map((e) => ({
        time: formatDisplayTime(e.startTime),
        end: formatDisplayTime(e.endTime),
        title: e.title,
        color: "border-emerald-500",
        initials: e.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      }))
    return detectConflicts(dayEvents)
  })()

  return (
    <div className="flex h-screen flex-col bg-[#f5f5f5]">
      <TopNav selectedValue="Dashboard" />
      <div className="flex flex-1 overflow-hidden">
        {isLoading ? (
          <InboxPanelSkeleton />
        ) : (
          <InboxPanel
            emails={emails}
            selectedEmail={selectedEmail!}
            onSelectEmail={setSelectedEmail}
          />
        )}
        <CommandPanel
          emails={emails.map((e) => ({ id: e.id, sender: e.sender, subject: e.subject, snippet: e.snippet }))}
          events={allEvents.map((e) => ({ title: e.title, date: e.date, startTime: e.startTime, endTime: e.endTime }))}
        />
        <CalendarPanel schedule={schedule} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
    </div>
  )
}
