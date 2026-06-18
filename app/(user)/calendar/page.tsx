"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { TopNav } from "../components/top-nav"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import type { CalendarDayButton } from "@/components/ui/calendar"
import type { CalendarEvent } from "../components/types"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

const myCalendars = [
  { name: "John Doe", checked: true, color: "bg-blue-500" },
  { name: "Work", checked: true, color: "bg-emerald-500" },
  { name: "Personal", checked: true, color: "bg-purple-500" },
  { name: "Tasks", checked: false, color: "bg-yellow-500" },
  { name: "Birthdays", checked: false, color: "bg-pink-500" },
  { name: "Holidays", checked: false, color: "bg-red-500" },
]

const otherCalendars = [
  { name: "Add people's calendars", checked: false, color: "bg-gray-400" },
]

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 || 12
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function formatDateRange(start: Date, end: Date): string {
  const sMonth = start.toLocaleDateString("en-US", { month: "long" })
  const eMonth = end.toLocaleDateString("en-US", { month: "long" })
  if (sMonth === eMonth) {
    return `${sMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`
  }
  return `${sMonth} ${start.getDate()} – ${eMonth} ${end.getDate()}, ${end.getFullYear()}`
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function MiniDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof CalendarDayButton>) {
  return (
    <button
      className={cn(
        "flex size-7 items-center justify-center rounded-full text-xs",
        modifiers.selected
          ? "bg-black text-white font-medium hover:bg-black"
          : "text-foreground hover:bg-muted cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

function MiniCalendar({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(d) => d && onSelect(d)}
      className="w-full"
      classNames={{
        root: "w-full p-0",
        months: "w-full",
        month: "w-full gap-2",
        month_grid: "w-full",
        nav: "relative flex w-full items-center justify-between px-1",
        button_previous: "size-6 p-0 text-muted-foreground hover:bg-muted",
        button_next: "size-6 p-0 text-muted-foreground hover:bg-muted",
        month_caption: "flex h-8 w-full items-center justify-center",
        caption_label: "text-sm font-medium select-none",
        weekday: "flex-1 text-[0.7rem] font-normal text-muted-foreground select-none",
        week: "mt-1 flex w-full",
        day: "relative aspect-square h-full w-full p-0 text-center select-none",
        today: "text-foreground font-medium",
      }}
      components={{
        DayButton: MiniDayButton,
      }}
    />
  )
}

function WeekView({
  weekStart,
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
}: {
  weekStart: Date
  events: CalendarEvent[]
  selectedDate: Date
  onSelectDate: (d: Date) => void
  onSelectEvent: (e: CalendarEvent) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date()
      const hour = now.getHours()
      scrollRef.current.scrollTop = hour * 64
    }
  }, [])
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const getEventsForDay = useCallback(
    (day: Date) => events.filter((e) => isSameDay(new Date(e.date), day)),
    [events]
  )

  const getEventPosition = (event: CalendarEvent) => {
    const startMin = parseTimeToMinutes(event.startTime)
    const endMin = parseTimeToMinutes(event.endTime)
    const dayStart = HOURS[0] * 60
    const top = ((startMin - dayStart) / 60) * 64
    const height = Math.max(((endMin - startMin) / 60) * 64, 24)
    return { top, height }
  }

  const getEventColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
      purple: "bg-purple-50 border-purple-200 text-purple-900",
      red: "bg-red-50 border-red-200 text-red-900",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
      gray: "bg-gray-50 border-gray-200 text-gray-900",
    }
    return colors[color || "blue"] || colors.blue
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Fixed day headers */}
      <div className="flex border-b">
        <div className="w-16 shrink-0" />
        <div className="flex flex-1">
          {weekDays.map((day, dayIdx) => {
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)
            return (
              <div
                key={dayIdx}
                className={cn(
                  "flex-1 flex items-center justify-center border-b border-l border-r border-gray-100 py-2",
                  isSelected && "bg-gray-50/50"
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-gray-400">{WEEKDAY_LABELS[dayIdx]}</span>
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-sm font-medium",
                      isToday ? "bg-black text-white" : "text-gray-700"
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex flex-1 overflow-y-auto scrollbar-hide">
        <div className="w-16 shrink-0">
          {HOURS.map((hour) => (
            <div key={hour} className="h-16 border-b pl-2 pt-0.5">
              <span className="text-[11px] text-gray-400">
                {hour === 0 ? "12 AM" : hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex flex-1">
          {weekDays.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day)
            const isSelected = isSameDay(day, selectedDate)

            return (
              <div
                key={dayIdx}
                className="flex-1"
                onClick={() => onSelectDate(day)}
              >
                <div className="relative">
                  {HOURS.map((hour) => (
                    <div key={hour} className={cn(
                      "h-16 border-b border-l border-r border-gray-100",
                      isSelected && "bg-gray-50/50"
                    )} />
                  ))}
                  {dayEvents.map((event) => {
                    const { top, height } = getEventPosition(event)
                    return (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectEvent(event)
                        }}
                        className={cn(
                          "absolute left-0.5 right-0.5 rounded-md border px-2 py-1 text-left text-[11px] leading-tight transition-shadow hover:shadow-md z-10",
                          getEventColor(event.color)
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {height > 30 && (
                          <div className="truncate opacity-70">
                            {formatTime(event.startTime)} – {formatTime(event.endTime)}
                          </div>
                        )}
                      </button>
                    )
          })}
          <div className="w-[15px] shrink-0 border-b border-gray-100 bg-gray-50" />
        </div>
      </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DayView({
  date,
  events,
  onSelectEvent,
}: {
  date: Date
  events: CalendarEvent[]
  onSelectEvent: (e: CalendarEvent) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date()
      const hour = now.getHours()
      scrollRef.current.scrollTop = hour * 64
    }
  }, [])
  const dayEvents = useMemo(
    () => events.filter((e) => isSameDay(new Date(e.date), date)),
    [events, date]
  )

  const getEventPosition = (event: CalendarEvent) => {
    const startMin = parseTimeToMinutes(event.startTime)
    const endMin = parseTimeToMinutes(event.endTime)
    const dayStart = HOURS[0] * 60
    const top = ((startMin - dayStart) / 60) * 64
    const height = Math.max(((endMin - startMin) / 60) * 64, 24)
    return { top, height }
  }

  const getEventColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
      purple: "bg-purple-50 border-purple-200 text-purple-900",
      red: "bg-red-50 border-red-200 text-red-900",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
      gray: "bg-gray-50 border-gray-200 text-gray-900",
    }
    return colors[color || "blue"] || colors.blue
  }

  const dayIdx = (date.getDay() + 6) % 7

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Fixed day header */}
      <div className="flex border-b">
        <div className="w-16 shrink-0 border-r border-gray-100" />
        <div className="flex-1 flex items-center justify-center border-b border-r border-gray-100 py-2">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-gray-400">{WEEKDAY_LABELS[dayIdx]}</span>
            <span className={cn(
              "flex size-7 items-center justify-center rounded-full text-sm font-medium",
              isSameDay(date, new Date()) ? "bg-black text-white" : "text-gray-700"
            )}>
              {date.getDate()}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex flex-1 overflow-y-auto scrollbar-hide">
        <div className="w-16 shrink-0">
          {HOURS.map((hour) => (
            <div key={hour} className="h-16 border-b border-r border-gray-100 pl-2 pt-0.5">
              <span className="text-[11px] text-gray-400">
                {hour === 0 ? "12 AM" : hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-gray-50/30">
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="h-16 border-b border-r border-gray-100" />
            ))}
            {dayEvents.map((event) => {
              const { top, height } = getEventPosition(event)
              return (
                <button
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className={cn(
                    "absolute left-0.5 right-0.5 rounded-md border px-2 py-1 text-left text-[11px] leading-tight transition-shadow hover:shadow-md z-10",
                    getEventColor(event.color)
                  )}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  {height > 30 && (
                    <div className="truncate opacity-70">
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthView({
  monthStart,
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
}: {
  monthStart: Date
  events: CalendarEvent[]
  selectedDate: Date
  onSelectDate: (d: Date) => void
  onSelectEvent: (e: CalendarEvent) => void
}) {
  const calendarDays = useMemo(() => {
    const year = monthStart.getFullYear()
    const month = monthStart.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const totalDays = lastDay.getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [monthStart])

  const getEventsForDay = useCallback(
    (day: Date) => events.filter((e) => isSameDay(new Date(e.date), day)),
    [events]
  )

  const getEventColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      emerald: "bg-emerald-100 text-emerald-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      gray: "bg-gray-100 text-gray-800",
    }
    return colors[color || "blue"] || colors.blue
  }

  const rows = Math.ceil(calendarDays.length / 7)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2 text-center text-xs font-medium text-gray-500">
            {label}
          </div>
        ))}
      </div>
      <div
        className="grid flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {calendarDays.map((day, i) => {
          if (!day) return <div key={i} className="border-b border-r bg-gray-50/30" />
          const dayEvents = getEventsForDay(day)
          const isToday = isSameDay(day, new Date())
          const isSelected = isSameDay(day, selectedDate)
          return (
            <div
              key={i}
              className={cn(
                "border-b border-r p-1 cursor-pointer hover:bg-gray-50",
                isSelected && "bg-gray-50"
              )}
              onClick={() => onSelectDate(day)}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday ? "bg-black text-white" : "text-gray-700"
                )}
              >
                {day.getDate()}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectEvent(event)
                    }}
                    className={cn(
                      "w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium",
                      getEventColor(event.color)
                    )}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <span className="block text-[10px] text-gray-400 px-1">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AgendaView({
  date,
  events,
  onSelectEvent,
}: {
  date: Date
  events: CalendarEvent[]
  onSelectEvent: (e: CalendarEvent) => void
}) {
  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => new Date(e.date) >= new Date(date.getFullYear(), date.getMonth(), date.getDate()))
      .sort((a, b) => {
        const dA = new Date(a.date)
        const dB = new Date(b.date)
        if (dA.getTime() !== dB.getTime()) return dA.getTime() - dB.getTime()
        return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
      })
      .slice(0, 50)
  }, [events, date])

  const groupedByDate = useMemo(() => {
    const groups: { date: Date; events: CalendarEvent[] }[] = []
    let current: { date: Date; events: CalendarEvent[] } | null = null
    for (const event of upcomingEvents) {
      const eventDate = new Date(event.date)
      if (!current || !isSameDay(current.date, eventDate)) {
        current = { date: eventDate, events: [] }
        groups.push(current)
      }
      current.events.push(event)
    }
    return groups
  }, [upcomingEvents])

  const getBorderLeft = (color?: string) => {
    const colors: Record<string, string> = {
      blue: "border-l-blue-500",
      emerald: "border-l-emerald-500",
      purple: "border-l-purple-500",
      red: "border-l-red-500",
      yellow: "border-l-yellow-500",
      gray: "border-l-gray-400",
    }
    return colors[color || "blue"] || colors.blue
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {groupedByDate.length === 0 ? (
        <p className="text-sm text-gray-400">No upcoming events</p>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map((group) => (
            <div key={group.date.toISOString()}>
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                {formatDateLong(group.date)}
              </h3>
              <div className="space-y-2">
                {group.events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className={cn(
                      "w-full rounded-lg border-l-4 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100",
                      getBorderLeft(event.color)
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {formatTime(event.startTime)} – {formatTime(event.endTime)}
                        </div>
                      </div>
                      {event.meetingLink && (
                        <svg className="size-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DayAgenda({
  date,
  events,
  selectedEvent,
  onSelectEvent,
}: {
  date: Date
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  onSelectEvent: (e: CalendarEvent | null) => void
}) {
  const dayEvents = useMemo(
    () => events.filter((e) => isSameDay(new Date(e.date), date)),
    [events, date]
  )

  const getBorderColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: "border-l-blue-500",
      emerald: "border-l-emerald-500",
      purple: "border-l-purple-500",
      red: "border-l-red-500",
      yellow: "border-l-yellow-500",
      gray: "border-l-gray-400",
    }
    return colors[color || "blue"] || colors.blue
  }

  return (
    <aside className="hidden w-80 flex-col border-l bg-white lg:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{formatDateLong(date)}</h3>
        <button
          onClick={() => onSelectEvent(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {dayEvents.length === 0 ? (
          <p className="text-sm text-gray-400">No events scheduled</p>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={cn(
                  "w-full rounded-lg border-l-4 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100",
                  getBorderColor(event.color),
                  selectedEvent?.id === event.id && "ring-2 ring-black"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </div>
                  </div>
                  {event.meetingLink && (
                    <svg className="size-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}
                </div>
                {event.description && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">{event.description}</p>
                )}
              </button>
            ))}
          </div>
        )}

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add event
        </button>
      </div>

      {/* Karya AI */}
      <div className="flex flex-col border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span className="text-sm font-medium">Karya AI</span>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">New</span>
        </div>

        {/* AI output area */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-gray-100">
              <svg className="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-700">Hi, I'm Karya</p>
            <p className="mt-1 text-[11px] text-gray-400">
              I can help you schedule meetings,<br />find available times, and more.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Karya AI..."
              className="flex-1 rounded-lg border bg-gray-50 px-3 py-2 text-xs outline-none focus:border-gray-400"
            />
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const [monthStart, setMonthStart] = useState<Date>(() => getMonthStart(new Date()))
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useState<"Day" | "Week" | "Month" | "Agenda">("Week")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => setEvents(data?.events ?? []))
      .catch((err) => console.error("Failed to fetch calendar events:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart])

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setWeekStart(getWeekStart(today))
    setMonthStart(getMonthStart(today))
  }

  const goToPrev = () => {
    if (view === "Week") setWeekStart((s) => addDays(s, -7))
    else if (view === "Day") setSelectedDate((d) => addDays(d, -1))
    else if (view === "Month") setMonthStart((s) => addMonths(s, -1))
  }

  const goToNext = () => {
    if (view === "Week") setWeekStart((s) => addDays(s, 7))
    else if (view === "Day") setSelectedDate((d) => addDays(d, 1))
    else if (view === "Month") setMonthStart((s) => addMonths(s, 1))
  }

  const getDateLabel = () => {
    if (view === "Day") return formatDateLong(selectedDate)
    if (view === "Week") return formatDateRange(weekStart, weekEnd)
    if (view === "Month") return formatMonthYear(monthStart)
    return formatDateLong(selectedDate)
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <TopNav selectedValue="Calendar" />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="flex w-60 flex-col border-r bg-white">
          {/* Create button */}
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Mini Calendar */}
          <div className="px-2 py-1">
            <MiniCalendar selected={selectedDate} onSelect={(d) => {
              setSelectedDate(d)
              setWeekStart(getWeekStart(d))
            }} />
          </div>

          {/* Today button */}
          <div className="px-4 py-2">
            <button
              onClick={goToToday}
              className="w-full rounded-lg border px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              Today
            </button>
          </div>

          {/* My calendars */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">My calendars</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            {myCalendars.map((cal) => (
              <label
                key={cal.name}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={cal.checked}
                  className="size-3.5 rounded border-gray-300"
                />
                <span className={cn("size-2.5 rounded-full", cal.color)} />
                {cal.name}
              </label>
            ))}

            <button className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add calendar
            </button>

            {/* Other calendars */}
            <div className="mt-4 mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Other calendars</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            {otherCalendars.map((cal) => (
              <button
                key={cal.name}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {cal.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrev}
                  className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                {getDateLabel()}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* View switcher */}
              <div className="flex rounded-lg border">
                {(["Day", "Week", "Month", "Agenda"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "px-3 py-1.5 text-sm transition-colors first:rounded-l-lg last:rounded-r-lg",
                      view === v
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Settings */}
              <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Views */}
          {view === "Week" && (
            <WeekView
              weekStart={weekStart}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {view === "Day" && (
            <DayView
              date={selectedDate}
              events={events}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {view === "Month" && (
            <MonthView
              monthStart={monthStart}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {view === "Agenda" && (
            <AgendaView
              date={selectedDate}
              events={events}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </main>

        {/* Right Sidebar */}
        <DayAgenda
          date={selectedDate}
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>
    </div>
  )
}
