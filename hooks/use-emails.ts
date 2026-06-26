"use client"

import { useQuery } from "@tanstack/react-query"
import type { Email, CalendarEvent } from "@/app/(user)/components/types"

interface EmailsResponse {
  emails: Email[]
  nextPageToken: string
  message?: string
}

interface EmailDetailResponse {
  id: string
  threadId: string
  sender: string
  to: string
  subject: string
  date: string
  snippet: string
  body: string
  bodyHtml?: string
  attachments: { filename: string; mimeType: string; size: number; attachmentId: string }[]
  labels: string[]
  isCalendar: boolean
}

interface EmailCountResponse {
  total: number
}

interface CalendarResponse {
  events: CalendarEvent[]
  message?: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export function useEmails(query: string, pageToken?: string) {
  return useQuery<EmailsResponse>({
    queryKey: ["emails", query, pageToken ?? ""],
    queryFn: () => {
      const params = new URLSearchParams({ q: query })
      if (pageToken) params.set("nextPageToken", pageToken)
      return fetchJson(`/api/emails?${params.toString()}`)
    },
  })
}

export function useEmailDetail(id: string | null) {
  return useQuery<EmailDetailResponse>({
    queryKey: ["email", id],
    queryFn: () => fetchJson(`/api/emails/${id}`),
    enabled: !!id,
  })
}

export function useEmailCount(query: string) {
  return useQuery<EmailCountResponse>({
    queryKey: ["emailCount", query],
    queryFn: () => {
      const params = query ? `?q=${encodeURIComponent(query)}` : ""
      return fetchJson(`/api/emails/count${params}`)
    },
  })
}

export function useEmailSearch(query: string) {
  return useQuery<EmailsResponse>({
    queryKey: ["emailSearch", query],
    queryFn: () => {
      const params = new URLSearchParams({ q: query })
      return fetchJson(`/api/emails/search?${params.toString()}`)
    },
    enabled: query.trim().length > 0,
  })
}

export function useCalendarEvents() {
  return useQuery<CalendarResponse>({
    queryKey: ["calendarEvents"],
    queryFn: () => fetchJson("/api/calendar"),
  })
}
