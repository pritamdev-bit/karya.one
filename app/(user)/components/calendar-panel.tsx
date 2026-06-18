"use client"
import { cn } from '@/lib/utils'
import { Calendar, type CalendarDayButton } from '@/components/ui/calendar'
import type { ScheduleEvent } from './types'

interface CalendarPanelProps {
  schedule: ScheduleEvent[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

function DayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof CalendarDayButton>) {
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

export function CalendarPanel({ schedule, selectedDate, onSelectDate }: CalendarPanelProps) {
  const isSelectedToday = selectedDate.toDateString() === new Date().toDateString()
  const dateLabel = isSelectedToday
    ? "Today's schedule"
    : selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  return (
    <aside className="flex w-72 flex-col border-l bg-white">
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-sm font-semibold">Calendar</span>
        </div>
      </div>

      <div className="px-2 py-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && onSelectDate(d)}
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
            DayButton,
          }}
        />
      </div>

      <div className="border-t px-4 py-3">
        <h3 className="mb-3 text-sm font-medium">{dateLabel}</h3>
        <div className="space-y-2">
          {schedule.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 w-14 shrink-0 text-right">
                <div className="text-xs text-muted-foreground w-fit">{event.time}</div>
                <div className="text-xs text-muted-foreground w-fit">{event.end}</div>
              </div>
              <div className={cn("mt-1 h-8 w-0.5 shrink-0 rounded-full", event.color === "border-red-500" ? "bg-red-500" : event.color === "border-emerald-500" ? "bg-emerald-500" : "bg-border")} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{event.title}</span>
                  {event.initials && (
                    <span className="flex size-5 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
                      {event.initials}
                    </span>
                  )}
                </div>
                {event.conflict && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-amber-600">
                    <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
                    </svg>
                    Conflict
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
