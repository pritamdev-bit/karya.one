"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "../components/top-nav"
import { InboxCommandPanel } from "../components/inbox-command-panel"
import { cn } from "@/lib/utils"
import type { Email } from "../components/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useEmails, useEmailCount, useCalendarEvents, useEmailSearch } from "@/hooks/use-emails"

const PANEL_MIN = 280
const PANEL_MAX = 600
const PANEL_DEFAULT = 360

const sidebarNav = [
  { label: "Inbox", icon: "inbox", query: "category:primary" },
  { label: "Starred", icon: "star", query: "is:starred" },
  { label: "Snoozed", icon: "clock", query: "is:snoozed" },
  { label: "Sent", icon: "send", query: "in:sent" },
  { label: "Drafts", icon: "file", query: "in:draft" },
  { label: "Purchases", icon: "receipt", query: "category:purchases" },
  { label: "More", icon: "chevron-down", query: "" },
]

const labels = [
  { name: "Project Karya", color: "bg-gray-400" },
  { name: "Personal", color: "bg-gray-400" },
  { name: "Team", color: "bg-gray-400" },
  { name: "Newsletters", color: "bg-gray-400" },
  { name: "Travel", color: "bg-gray-400" },
]

const tabs = [
  { label: "Primary", icon: "inbox" },
  { label: "Promotions" },
  { label: "Social" },
  { label: "Updates" },
]

const SidebarIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    inbox: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2 2 0 011.789 1.104l.928 1.856a2 2 0 001.789 1.104h3.23a2 2 0 001.789-1.104l.928-1.856A2 2 0 0117.89 13.5h3.86m-16.5 0V6.75a2 2 0 012-2h10.5a2 2 0 012 2v6.75m-16.5 0l-1.575 5.25a1 1 0 001 1.25h13.15a1 1 0 001-1.25L18.75 13.5" /></svg>,
    star: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    clock: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    send: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
    file: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    receipt: <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>,
    "chevron-down": <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  }
  return icons[icon] || null
}

function EmailListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b px-4 py-2.5">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-32" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("Primary")
  const [activeNav, setActiveNav] = useState("Inbox")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [pageStack, setPageStack] = useState<{ query: string; token: string }[]>([])
  const [pageToken, setPageToken] = useState("")
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT)
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(PANEL_DEFAULT)
  const router = useRouter()
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentQuery = searchQuery
    ? searchQuery
    : activeNav === "Inbox"
      ? `category:${activeTab.toLowerCase()}`
      : (sidebarNav.find((n) => n.label === activeNav)?.query ?? "category:primary")

  const { data: emailsData, isLoading: isLoadingEmails } = useEmails(currentQuery, pageToken || undefined)
  const { data: countData } = useEmailCount(currentQuery)
  const { data: calendarData } = useCalendarEvents()
  const { data: searchData, isLoading: isSearching } = useEmailSearch(searchQuery)

  const isSearchMode = searchQuery.trim().length > 0
  const emails = isSearchMode ? (searchData?.emails ?? []) : (emailsData?.emails ?? [])
  const isLoading = isSearchMode ? isSearching : isLoadingEmails
  const allEvents = calendarData?.events ?? []
  const totalCount = countData?.total ?? 0
  const unreadCount = emails.filter((e) => e.unread).length

  const handleNavChange = (label: string) => {
    setActiveNav(label)
    setActiveTab("Primary")
    setSearchInput("")
    setSearchQuery("")
    setPageToken("")
    setPageStack([])
  }

  const handleTabChange = (label: string) => {
    if (activeNav !== "Inbox") return
    setSearchInput("")
    setSearchQuery("")
    setActiveTab(label)
    setPageToken("")
    setPageStack([])
  }

  const goToNextPage = () => {
    const nextToken = emailsData?.nextPageToken
    if (!nextToken) return
    setPageStack((prev) => [...prev, { query: currentQuery, token: pageToken }])
    setPageToken(nextToken)
  }

  const goToPrevPage = () => {
    if (pageStack.length === 0) return
    const newStack = [...pageStack]
    const prev = newStack.pop()!
    setPageStack(newStack)
    setPageToken(prev.token)
  }

  const handleSearch = (value: string) => {
    setSearchInput(value)
    clearTimeout(searchDebounce.current ?? undefined)
    if (!value.trim()) {
      setSearchQuery("")
      setPageToken("")
      setPageStack([])
      return
    }
    searchDebounce.current = setTimeout(() => {
      setSearchQuery(value)
      setPageToken("")
      setPageStack([])
    }, 300)
  }

  const handleSelectEmail = (email: Email) => {
    router.push(`/inbox/${email.id}`)
  }

  const toggleEmail = (id: string) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  const formatSender = (sender: string) => {
    if (!sender) return "Unknown"
    const match = sender.match(/^([^<]+)</)
    return match ? match[1].trim() : sender
  }

  const formatEmailTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) {
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = panelWidth
    document.addEventListener("mousemove", handleDragMove)
    document.addEventListener("mouseup", handleDragEnd)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    const delta = startX.current - e.clientX
    const newWidth = Math.min(PANEL_MAX, Math.max(PANEL_MIN, startWidth.current + delta))
    setPanelWidth(newWidth)
  }, [])

  const handleDragEnd = useCallback(() => {
    isDragging.current = false
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [handleDragMove])

  useEffect(() => {
    return () => {
      clearTimeout(searchDebounce.current ?? undefined)
      document.removeEventListener("mousemove", handleDragMove)
      document.removeEventListener("mouseup", handleDragEnd)
    }
  }, [handleDragMove, handleDragEnd])

  return (
    <div className="flex h-screen flex-col bg-white overflow-y-hidden">
      <TopNav selectedValue="Inbox" />
      <div className="flex flex-1 overflow-y-hidden">
        {/* Left Sidebar */}
        <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r bg-white">
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Compose
            </button>
          </div>

          <nav className="flex-1 px-2">
            {sidebarNav.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "More") return
                  handleNavChange(item.label)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeNav === item.label
                    ? "bg-gray-100 font-medium text-black"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <SidebarIcon icon={item.icon} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.label === "Inbox" && unreadCount > 0 && (
                  <span className="text-xs text-gray-500">{unreadCount.toLocaleString()}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Labels</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
            {labels.map((label) => (
              <button
                key={label.name}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <span className={cn("size-2.5 rounded-full", label.color)} />
                <span className="flex-1 text-left">{label.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300"
              />
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13-6.75L16.5 19m0 0L12 14.5m4.5 4.5V10.5" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </button>
              <div className="relative ml-2">
                <svg className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search mail"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-8 w-56 rounded-full border bg-gray-50 pl-9 pr-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{isLoading ? "Loading..." : `${pageStack.length * 20 + 1}-${pageStack.length * 20 + emails.length} of ${totalCount.toLocaleString()}`}</span>
              <button
                onClick={goToPrevPage}
                disabled={pageStack.length === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={goToNextPage}
                disabled={!emailsData?.nextPageToken}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0 items-center gap-6 border-b px-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab.label)}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 text-sm transition-colors",
                  activeTab === tab.label && activeNav === "Inbox"
                    ? "border-black font-medium text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700",
                  activeNav !== "Inbox" && "pointer-events-none opacity-40"
                )}
              >
                {tab.icon && <SidebarIcon icon={tab.icon} />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Email List */}
          {isLoading ? (
            <EmailListSkeleton />
          ) : emails.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
              <svg className="mb-3 size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <p className="text-sm">No emails yet</p>
              <p className="text-xs">Connect your Gmail to see your inbox</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectEmail(email)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectEmail(email) } }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 overflow-hidden border-b px-4 py-2.5 text-left transition-colors hover:bg-gray-50",
                    email.unread && "bg-gray-50/50"
                  )}
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300"
                    checked={selectedEmails.includes(email.id)}
                    onChange={() => toggleEmail(email.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="text-gray-300 hover:text-yellow-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                  <span className={cn("w-44 truncate text-sm", email.unread ? "font-semibold" : "text-gray-700")}>
                    {formatSender(email.sender)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{email.subject}</span>
                    {email.snippet?.trim() ? <span className="ml-1 text-gray-400">- {email.snippet.trim()}</span> : null}
                  </span>
                  {email.isCalendar && (
                    <svg className="size-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  )}
                  <span className="w-fit shrink-0 text-right text-xs text-gray-400">{formatEmailTime(email.time)}</span>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Panel - Email Detail or Karya AI */}
          <div className="relative hidden min-h-0 flex-col overflow-hidden border-l bg-white lg:flex" style={{ width: panelWidth }}>
            {/* Drag Handle */}
            <div
              onMouseDown={handleDragStart}
              className="group absolute left-0 top-0 z-10 flex h-full w-1 cursor-col-resize items-center justify-center hover:bg-gray-200"
            >
              <div className="h-8 w-0.5 rounded-full bg-gray-300 group-hover:bg-gray-500" />
            </div>
            <InboxCommandPanel
              emails={emails.map((e) => ({ id: e.id, sender: e.sender, subject: e.subject, snippet: e.snippet }))}
              events={allEvents.map((e) => ({ title: e.title, date: e.date, startTime: e.startTime, endTime: e.endTime }))}
            />
          </div>
      </div>
    </div>
  )
}
