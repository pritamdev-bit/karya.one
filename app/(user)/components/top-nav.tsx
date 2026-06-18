"use client"
import { useUser, useClerk } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = ["Dashboard", "Inbox", "Calendar", "Compose"]

export function TopNav({ selectedValue }: { selectedValue: string }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [selectedItem, setSelectedItem] = useState(selectedValue);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-black text-white text-xs font-bold">
            <img src="favicon.ico" alt="logo" className="size-6 rounded-md" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Karya.one</span>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <button
                onClick={() => {
                  setSelectedItem(item);
                }}
                className={cn(
                  "px-3 py-1.5 text-sm transition-colors rounded-md",
                  item === selectedItem
                    ? "font-medium text-black"
                    : "text-muted-foreground hover:text-black"
                )}
              >
                {item}
              </button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          synced
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs font-medium cursor-pointer outline-none">
              {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                const res = await fetch("/api/revoke-access", { method: "POST" });
                if (res.ok) {
                  window.location.href = "/onboarding";
                }
              }}
            >
              Disconnect Google
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
