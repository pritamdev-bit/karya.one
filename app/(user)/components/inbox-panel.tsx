import { cn } from '@/lib/utils'
import type { Email } from './types'

interface InboxPanelProps {
  emails: Email[]
  selectedEmail: Email
  onSelectEmail: (email: Email) => void
}

export function InboxPanel({ emails, selectedEmail, onSelectEmail }: InboxPanelProps) {
  return (
    <aside className="flex w-80 flex-col border-r bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-semibold">Inbox</span>
        </div>
        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {emails?.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {emails?.map((email) => (
          <button
            key={email?.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              "flex w-full flex-col gap-2 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
              selectedEmail?.id === email?.id && "bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {email?.unread && (
                  <span className="inline-block size-1.5 rounded-full bg-black" />
                )}
                <span className={cn("text-sm", email?.unread ? "font-medium" : "")}>
                  {email?.sender?.split(" ")[0]}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{email?.time}</span>
            </div>
            <div className="text-xs font-medium text-foreground min-w-0 truncate">{email?.subject}</div>
            <div className={`text-xs text-muted-foreground min-w-0 truncate`}>{email?.snippet?.trim()}</div>
          </button>
        ))}
      </div>

      <div className="border-t p-3 text-center">
        <button className="text-xs text-muted-foreground hover:text-foreground">
          View all messages →
        </button>
      </div>
    </aside>
  )
}
