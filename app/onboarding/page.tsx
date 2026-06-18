"use client"

import { useUser } from "@clerk/nextjs"
import { Mail, CalendarDays, Sparkles, Link2, Shield, Check } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const features = [
  {
    icon: Mail,
    title: "Read, write, and organize emails",
    description: "Summarize threads, draft replies, and stay on top of your inbox.",
  },
  {
    icon: CalendarDays,
    title: "Manage your schedule",
    description: "Create events, find time, and keep your day organized.",
  },
  {
    icon: Sparkles,
    title: "AI that works for you",
    description: "Ask questions, give commands, and get things done across your email and calendar.",
  },
]

function OnboardingContent() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const connected = searchParams.get("connected")

  const initials = user?.firstName?.charAt(0) || "U"
  const gmailConnected = connected === "gmail"

  return (
    <div className="flex h-screen flex-col bg-[#f9f8f6]">
      {/* Top Nav */}
      <header className="flex h-14 shrink-0 items-center justify-between bg-[#f9f8f6] px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
            ◎
          </span>
          KARYA.ONE
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
            {initials}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pt-6 pb-4">
        {/* Heading */}
        <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Connect your Google accounts
        </h1>
        <p className="mb-6 max-w-md text-center text-base text-gray-500 leading-relaxed">
          Connect Gmail and Google Calendar to let AI help you manage your email
          and schedule.
        </p>

        {/* Connection Card */}
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Icons Row */}
          <div className="flex items-center justify-center gap-6 mb-5">
            {/* Gmail Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border bg-white ${gmailConnected ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                {gmailConnected ? (
                  <Check className="h-8 w-8 text-green-600" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                    <path
                      d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
                      fill="#F1F1F1"
                    />
                    <path d="M22 6L12 13L2 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="2" y="4" width="4" height="16" fill="#4285F4" rx="0" />
                    <rect x="18" y="4" width="4" height="16" fill="#4285F4" rx="0" />
                    <path d="M6 20V9L12 13L18 9V20" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 6L12 13L22 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-gray-900">Gmail</span>
            </div>

            {/* Link Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white">
              <Link2 className="h-4 w-4 text-gray-400" />
            </div>

            {/* Google Calendar Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="2" />
                  <path d="M3 10H21" stroke="#4285F4" strokeWidth="2" />
                  <path d="M8 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
                  <text x="12" y="18" textAnchor="middle" fill="#1A73E8" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">
                    31
                  </text>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Google Calendar</span>
            </div>
          </div>

          {/* Separator */}
          <div className="mb-5 border-t border-gray-100" />

          {/* Features */}
          <div className="flex flex-1 flex-col justify-center gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                  <feature.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Connect Button */}
          {gmailConnected ? (
            <a
              href="/api/connect?plugin=googlecalendar"
              className="mt-5 flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
                <path d="M3 10H21" stroke="white" strokeWidth="2" />
                <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Connect Google Calendar
            </a>
          ) : (
            <a
              href="/api/connect?plugin=gmail"
              className="mt-5 flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Connect Gmail &amp; Google Calendar
            </a>
          )}

          {/* Security Note */}
          <div className="mt-3 flex shrink-0 items-center justify-center gap-2 text-xs text-gray-400">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Secure, private, and encrypted
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mt-auto flex shrink-0 flex-col items-center pt-4 text-center">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">
            We respect your privacy
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            We will never store your email or calendar data. You&apos;re in control. You can disconnect anytime.{" "}
            <Link
              href="#"
              className="underline decoration-gray-300 underline-offset-2 hover:text-gray-700"
            >
              Learn more.
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#f9f8f6]">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
