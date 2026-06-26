"use client"

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Dot grid pattern */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#9ca3af" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Large rotating ring cluster - top right */}
      <svg
        className="absolute -right-20 -top-32 h-[700px] w-[700px]"
        viewBox="0 0 700 700"
        fill="none"
      >
        <g className="origin-center" style={{ animation: "spin 120s linear infinite" }}>
          <circle cx="350" cy="350" r="150" stroke="#d1d5db" strokeWidth="1" />
          <circle cx="350" cy="350" r="220" stroke="#e5e7eb" strokeWidth="0.75" strokeDasharray="8 12" />
          <circle cx="350" cy="350" r="290" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="4 20" />
        </g>
        <g className="origin-center" style={{ animation: "spin 80s linear infinite reverse" }}>
          <circle cx="350" cy="350" r="180" stroke="#e5e7eb" strokeWidth="0.75" />
          <circle cx="350" cy="350" r="250" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="6 16" />
        </g>
        {/* Orbiting dots */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle
            key={i}
            cx="350"
            cy="350"
            r="3"
            fill="#9ca3af"
            opacity="0.5"
            style={{
              transformOrigin: "350px 350px",
              animation: `spin ${40 + i * 8}s linear infinite`,
              transform: `rotate(${angle}deg) translateX(${160 + (i % 2) * 60}px)`,
            }}
          />
        ))}
      </svg>

      {/* Floating geometric shapes - left side */}
      <svg
        className="absolute -left-16 top-[15%] h-[500px] w-[500px]"
        viewBox="0 0 500 500"
        fill="none"
      >
        {/* Rotating square */}
        <rect
          x="200" y="200" width="100" height="100" rx="8"
          stroke="#d1d5db" strokeWidth="1.5"
          style={{ transformOrigin: "250px 250px", animation: "spin 60s linear infinite" }}
        />
        {/* Floating circles */}
        <circle cx="100" cy="120" r="50" stroke="#d1d5db" strokeWidth="1" style={{ animation: "float 8s ease-in-out infinite" }} />
        <circle cx="380" cy="350" r="35" stroke="#e5e7eb" strokeWidth="1" style={{ animation: "float 10s ease-in-out infinite 2s" }} />
        <circle cx="200" cy="420" r="20" stroke="#d1d5db" strokeWidth="1" style={{ animation: "float 7s ease-in-out infinite 1s" }} />
        {/* Small diamond */}
        <rect
          x="350" y="80" width="30" height="30" rx="2"
          stroke="#d1d5db" strokeWidth="1"
          style={{ transformOrigin: "365px 95px", animation: "spin 30s linear infinite", transform: "rotate(45deg)" }}
        />
      </svg>

      {/* Bottom right cluster */}
      <svg
        className="absolute -right-10 bottom-[10%] h-[400px] w-[400px]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="100" stroke="#e5e7eb" strokeWidth="1" style={{ animation: "float 12s ease-in-out infinite" }} />
        <circle cx="200" cy="200" r="160" stroke="#d1d5db" strokeWidth="0.75" strokeDasharray="10 8" style={{ animation: "spin 90s linear infinite" }} />
        <circle cx="200" cy="200" r="60" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 12" style={{ animation: "spin 50s linear infinite reverse" }} />
        {/* Cross hairs */}
        <line x1="200" y1="140" x2="200" y2="260" stroke="#d1d5db" strokeWidth="0.75" opacity="0.5" />
        <line x1="140" y1="200" x2="260" y2="200" stroke="#d1d5db" strokeWidth="0.75" opacity="0.5" />
      </svg>

      {/* Floating horizontal accent lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800">
        <line x1="50" y1="180" x2="350" y2="180" stroke="#d1d5db" strokeWidth="1" style={{ animation: "lineFloat 15s ease-in-out infinite" }} />
        <line x1="850" y1="320" x2="1150" y2="320" stroke="#e5e7eb" strokeWidth="1" style={{ animation: "lineFloat 20s ease-in-out infinite 4s" }} />
        <line x1="150" y1="520" x2="500" y2="520" stroke="#d1d5db" strokeWidth="1" style={{ animation: "lineFloat 18s ease-in-out infinite 2s" }} />
        <line x1="700" y1="600" x2="1050" y2="600" stroke="#e5e7eb" strokeWidth="1" style={{ animation: "lineFloat 22s ease-in-out infinite 6s" }} />
      </svg>

      {/* Floating mail icon */}
      <svg
        className="absolute right-[12%] top-[18%] h-20 w-20"
        viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="0.75"
        style={{ animation: "drift 14s ease-in-out infinite" }}
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 4l10 8 10-8" />
      </svg>

      {/* Floating calendar icon */}
      <svg
        className="absolute left-[8%] top-[40%] h-16 w-16"
        viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="0.75"
        style={{ animation: "drift 18s ease-in-out infinite 3s" }}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4M16 2v4" strokeLinecap="round" />
      </svg>

      {/* Floating star icon */}
      <svg
        className="absolute right-[30%] bottom-[20%] h-12 w-12"
        viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="0.75"
        style={{ animation: "drift 16s ease-in-out infinite 5s" }}
      >
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>

      {/* Floating send/arrow icon */}
      <svg
        className="absolute left-[25%] bottom-[12%] h-14 w-14"
        viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="0.75"
        style={{ animation: "drift 20s ease-in-out infinite 7s" }}
      >
        <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Gradient fade edges */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}
