import { Skeleton } from '@/components/ui/skeleton'

export function InboxPanelSkeleton() {
  return (
    <aside className="flex w-80 flex-col border-r bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="size-5 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-1.5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>

      <div className="border-t p-3 text-center">
        <Skeleton className="mx-auto h-3 w-32" />
      </div>
    </aside>
  )
}
