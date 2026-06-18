"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "../../components/top-nav"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface EmailDetail {
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

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string) {
    if (mimeType.includes("pdf")) return "PDF"
    if (mimeType.includes("spreadsheet") || mimeType.includes("xlsx") || mimeType.includes("csv")) return "XLS"
    if (mimeType.includes("word") || mimeType.includes("docx")) return "DOC"
    if (mimeType.includes("image")) return "IMG"
    return "FILE"
}

export default function EmailDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [email, setEmail] = useState<EmailDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchEmail(params.id as string)
        }
    }, [params.id])

    const fetchEmail = async (id: string) => {
        try {
            const response = await fetch(`/api/emails/${id}`)
            const data = await response.json()
            setEmail(data)
        } catch (err) {
            console.error("Failed to fetch email:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const parseSender = (sender: string) => {
        const match = sender.match(/^([^<]+)\s*<([^>]+)>/)
        if (match) return { name: match[1].trim(), email: match[2] }
        return { name: sender, email: "" }
    }

    const getInitials = (name: string) => {
        return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    }

    if (isLoading) {
        return (
            <div className="flex h-screen flex-col bg-white">
                <TopNav selectedValue="Inbox" />
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 p-8">
                        <Skeleton className="mb-4 h-4 w-32" />
                        <Skeleton className="mb-6 h-8 w-96" />
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="size-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!email) {
        return (
            <div className="flex h-screen flex-col bg-white">
                <TopNav selectedValue="Inbox" />
                <div className="flex flex-1 items-center justify-center text-gray-400">
                    Email not found
                </div>
            </div>
        )
    }

    const { name: senderName, email: senderEmail } = parseSender(email.sender)

    return (
        <div className="flex h-screen flex-col bg-white">
            <TopNav selectedValue="Inbox" />
            <div className="flex flex-1 overflow-hidden">
                {/* Main content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between border-b px-6 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push("/inbox")}
                                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Back to inbox
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                Archive
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                Mark unread
                            </button>
                            <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Email content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-3xl px-8 py-6">
                            {/* Subject */}
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-semibold text-gray-900">{email.subject}</h1>
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">Inbox</span>
                                </div>
                                <button className="text-gray-300 hover:text-yellow-400">
                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sender */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                                        {getInitials(senderName)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{senderName}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{senderEmail}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{email.date}</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            {email.bodyHtml ? (
                                <div
                                    className="mb-8 text-sm leading-relaxed text-gray-700 [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full"
                                    dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
                                />
                            ) : (
                                <div className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                                    {email.body}
                                </div>
                            )}

                            {/* Attachments */}
                            {email.attachments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="mb-3 text-sm font-medium text-gray-900">Attachments ({email.attachments.length})</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {email.attachments.map((att) => (
                                            <div
                                                key={att.attachmentId}
                                                className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50"
                                            >
                                                <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">
                                                    {getFileIcon(att.mimeType)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{att.filename}</div>
                                                    <div className="text-xs text-gray-500">{att.mimeType.split("/").pop()?.toUpperCase()} · {formatSize(att.size)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggested actions */}
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Suggested actions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { icon: "pencil", label: "Draft a reply" },
                                        { icon: "calendar", label: "Schedule follow-up" },
                                        { icon: "checkbox", label: "Create task" },
                                        { icon: "users", label: "Notify team" },
                                    ].map((action) => (
                                        <button
                                            key={action.label}
                                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ask Karya */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="mb-3 flex gap-2">
                                    <svg className="size-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Ask Karya about this email..."
                                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                                    />
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["Draft a polite response", "Schedule meeting next week", "Summarize in 3 bullets", "Extract all deadlines"].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Karya AI Sidebar */}
                <aside className="hidden w-80 flex-col border-l bg-white lg:flex">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                            <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                            <span className="text-sm font-medium">Karya AI</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <p className="mb-4 text-sm font-medium text-gray-900">What would you like to do?</p>

                        <div className="space-y-2">
                            {[
                                { icon: "document", label: "Summarize" },
                                { icon: "pencil", label: "Draft Reply" },
                                { icon: "calendar", label: "Create Calendar Event" },
                                { icon: "checkbox", label: "Find Action Items" },
                                { icon: "translate", label: "Translate" },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <svg className="size-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>

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
                </aside>
            </div>
        </div>
    )
}
