"use client"
import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
    role: 'user' | 'assistant'
    content: string
    toolCalls?: string[]
}

interface InboxCommandPanelProps {
    emails?: { id: string; sender: string; subject: string; snippet: string }[]
    events?: { title: string; date: string; startTime: string; endTime: string }[]
}

export function InboxCommandPanel({ emails, events }: InboxCommandPanelProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || isStreaming) return

        const userMessage: Message = { role: 'user', content: text }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsStreaming(true)

        const assistantMessage: Message = { role: 'assistant', content: '', toolCalls: [] }
        setMessages((prev) => [...prev, assistantMessage])

        try {
            abortRef.current = new AbortController()

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.map((m) => ({ role: m.role, content: m.content })),
                    emails,
                    events,
                }),
                signal: abortRef.current.signal,
            })

            if (!res.ok) {
                const err = await res.json()
                setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                        role: 'assistant',
                        content: `Error: ${err.error ?? 'Request failed'}`,
                    }
                    return updated
                })
                return
            }

            const reader = res.body?.getReader()
            if (!reader) return

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() ?? ''

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue
                    const json = line.slice(6)
                    try {
                        const event = JSON.parse(json)
                        if (event.type === 'text') {
                            setMessages((prev) => {
                                const updated = [...prev]
                                const last = updated[updated.length - 1]
                                updated[updated.length - 1] = {
                                    ...last,
                                    content: last.content + event.content,
                                }
                                return updated
                            })
                        } else if (event.type === 'tool_call') {
                            setMessages((prev) => {
                                const updated = [...prev]
                                const last = updated[updated.length - 1]
                                updated[updated.length - 1] = {
                                    ...last,
                                    toolCalls: [...(last.toolCalls ?? []), event.tool],
                                }
                                return updated
                            })
                        } else if (event.type === 'error') {
                            setMessages((prev) => {
                                const updated = [...prev]
                                updated[updated.length - 1] = {
                                    role: 'assistant',
                                    content: `Error: ${event.content}`,
                                }
                                return updated
                            })
                        }
                    } catch {
                        // skip malformed JSON
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                        role: 'assistant',
                        content: `Error: ${err.message ?? 'Stream failed'}`,
                    }
                    return updated
                })
            }
        } finally {
            setIsStreaming(false)
            abortRef.current = null
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <main className="flex flex-1 flex-col bg-white overflow-y-hidden">
            <div className="border-b px-6 py-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Karya AI</h2>
                    <span className="text-sm text-muted-foreground italic">— natural language interface</span>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                            <svg className="size-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                            </svg>
                        </div>
                        <h3 className="mb-1 text-sm font-medium">How can I help?</h3>
                        <p className="text-xs text-muted-foreground">
                            Ask me about your emails, calendar, or anything else.
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                                msg.role === 'user'
                                    ? 'bg-black text-white'
                                    : 'bg-muted'
                            }`}>
                                {msg.toolCalls && msg.toolCalls.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-1">
                                        {msg.toolCalls.map((tool, j) => (
                                            <span key={j} className="inline-flex items-center gap-1 rounded border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21" />
                                                </svg>
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                        <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                )}
                                {isStreaming && msg.role === 'assistant' && i === messages.length - 1 && !msg.content && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:0.2s]" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:0.4s]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t px-6 py-4">
                <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3">
                    <input
                        type="text"
                        placeholder="Type a command or ask a question..."
                        className="flex-1 text-sm outline-none placeholder:text-muted-foreground"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isStreaming || !input.trim()}
                        className="flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-black/90 disabled:opacity-50"
                    >
                        {isStreaming ? (
                            <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </main>
    )
}
