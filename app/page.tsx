import Link from "next/link";
import {
  Check,
  Play,
  ArrowRight,
  Mail,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Send,
  Trash2,
  MoreHorizontal,
  Expand,
  Paperclip,
  Reply,
  Forward,
  Clock,
  MessageSquare,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

const trustBadges = [
  "Connect in 2 minutes",
  "No credit card required",
  "Works with Gmail & Calendar",
];

const emails = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    time: "9:41 AM",
    subject: "Project Update: Q3 Phase 1",
    preview: "Hi team, just wanted to check in on the progress...",
    color: "bg-gray-800",
  },
  {
    initials: "WS",
    name: "Weekly Sync",
    time: "8:15 AM",
    subject: "Meeting Agenda for Today",
    preview: "Please find the attached agenda for our afternoon...",
    color: "bg-gray-600",
  },
  {
    initials: "DL",
    name: "Delta Airlines",
    time: "Yesterday",
    subject: "Flight Confirmation: NYC to SFO",
    preview: "Your booking reference is HJ8K2. Departure at 1...",
    color: "bg-gray-700",
  },
  {
    initials: "MA",
    name: "Marcus Aurelius",
    time: "Yesterday",
    subject: "Design Review Feedback",
    preview: "I've gone through the latest wireframes and have...",
    color: "bg-gray-500",
  },
  {
    initials: "SU",
    name: "Substack",
    time: "Yesterday",
    subject: "Newsletter: The Friday Focus",
    preview: "The intersection of AI and craftsmanship in 2026...",
    color: "bg-gray-400",
  },
];

const calendarDays = [
  ["", "", "", "", "", "", ""],
  ["1", "2", "3", "4", "5", "6", "7"],
  ["8", "9", "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21"],
];

const schedule = [
  {
    time: "10:00",
    duration: "11:00",
    title: "Team Sync",
    avatar: "TR",
    color: "bg-gray-800",
  },
  {
    time: "13:00",
    duration: "14:00",
    title: "Design Workshop",
    avatar: "MA",
    color: "bg-gray-600",
  },
  {
    time: "13:30",
    duration: "14:30",
    title: "Client Call",
    avatar: "BC",
    color: "bg-gray-700",
    conflict: true,
  },
  {
    time: "16:00",
    duration: "17:00",
    title: "Focus Time",
    avatar: "",
    color: "",
    icon: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="rounded-md flex items-center justify-center text-white text-sm font-bold">
              <img src="favicon.ico" alt="logo" className="size-6 rounded-md" />
            </span>
            KARYA.ONE
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Use Gmail and Calendar
            <br />
            with AI.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect your Google accounts and let AI handle your email and schedule.
            Ask, command, and get things done.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/sign-up"
              className="bg-gray-900 text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Get started for free
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 bg-gray-100 text-gray-900 px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-200 transition-colors"
            >
              How it works
              <Play className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-900" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            {/* App Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold">
                    G
                  </span>
                  KARYA.ONE
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="text-gray-900 font-medium border-b-2 border-gray-900 pb-0.5">Dashboard</span>
                  <span className="hover:text-gray-900 cursor-pointer">Inbox</span>
                  <span className="hover:text-gray-900 cursor-pointer">Calendar</span>
                  <span className="hover:text-gray-900 cursor-pointer">Compose</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  synced
                </span>
                <div className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  JD
                </div>
              </div>
            </div>

            {/* App Body */}
            <div className="flex min-h-[480px]">
              {/* Sidebar - Inbox */}
              <div className="w-72 border-r border-gray-200 flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Mail className="w-4 h-4" />
                      Inbox
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">12</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {emails.map((email, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${i === 0 ? "bg-gray-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 ${email.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                          {email.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium truncate">{email.name}</span>
                            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{email.time}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-700 truncate">{email.subject}</div>
                          <div className="text-xs text-gray-400 truncate">{email.preview}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="text-sm text-gray-500 hover:text-gray-900 w-full text-center">
                    View all messages →
                  </button>
                </div>
              </div>

              {/* Main Content - Command & Draft */}
              <div className="flex-1 flex flex-col">
                {/* Command Bar */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span className="font-medium text-gray-900">Command</span>
                    <span>— natural language interface</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Draft Response</div>
                        <div className="text-xs text-gray-500">
                          Prepared a summary of the phase 1 deliverables to Sarah Jenkins.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Calendar Invite</div>
                        <div className="text-xs text-gray-500">
                          Shall I move the 1:30 PM call to 2:30 PM when you&apos;re free?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Prompt */}
                <div className="px-6 py-4">
                  <div className="flex justify-end">
                    <div className="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-md">
                      Let&apos;s see the draft. Make it a bit more formal and emphasize the timeline.
                    </div>
                  </div>
                </div>

                {/* Draft Email */}
                <div className="px-6 pb-4">
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Draft Reply</span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">Edit</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Editable</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Expand className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-medium mb-3">Dear Sarah,</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        Regarding the Q3 Phase 1 update, we have made significant progress on the core infrastructure. The deliverables are currently aligned with the projected timeline, with an anticipated completion by the end of next week.
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        I will provide a more detailed breakdown following our sync this afternoon.
                      </p>
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
                      <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                        Discard
                      </button>
                    </div>
                  </div>
                </div>

                {/* Command Input */}
                <div className="mt-auto px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    </div>
                    <input
                      type="text"
                      placeholder="Type a command or ask a question..."
                      className="flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
                      readOnly
                    />
                    <button className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Calendar */}
              <div className="w-64 border-l border-gray-200 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarDays className="w-4 h-4" />
                    Calendar
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">June 2026</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-0 text-center">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="text-[10px] text-gray-400 font-medium py-1">
                        {d}
                      </div>
                    ))}
                    {calendarDays.flat().map((day, i) => (
                      <div
                        key={i}
                        className={`text-xs py-1.5 rounded-full ${
                          day === "10"
                            ? "bg-gray-900 text-white font-medium"
                            : day === "9" || day === "11"
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        } ${day === "" ? "invisible" : "cursor-pointer hover:bg-gray-100"}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold mb-3">Today&apos;s schedule</h4>
                  <div className="space-y-2.5">
                    {schedule.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="text-[11px] text-gray-400 w-10 flex-shrink-0 pt-0.5">
                          {item.time}
                          <div className="text-[10px]">{item.duration}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.title}</span>
                            {item.avatar && (
                              <div className={`w-5 h-5 ${item.color} rounded flex items-center justify-center text-white text-[8px] font-bold`}>
                                {item.avatar}
                              </div>
                            )}
                            {item.icon && <Clock className="w-3.5 h-3.5 text-gray-400" />}
                          </div>
                          {item.conflict && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              Conflict
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-6">Securely connects with</p>
          <div className="flex items-center justify-center gap-10">
            <div className="flex items-center gap-2 text-gray-700">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium">Gmail</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="2" fill="none"/>
                <path d="M3 10h18" stroke="#4285F4" strokeWidth="2"/>
                <path d="M8 2v4M16 2v4" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
                <rect x="7" y="13" width="4" height="4" rx="0.5" fill="#34A853"/>
                <rect x="13" y="13" width="4" height="4" rx="0.5" fill="#FBBC05"/>
              </svg>
              <span className="text-sm font-medium">Calendar</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
