import { Skeleton } from '@/shared/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base, #F8FAFC)' }}>
      {/* Top bar skeleton */}
      <div
        className="h-14 flex items-center justify-between px-6"
        style={{ borderBottom: '1px solid var(--border-default, #E2E8F0)' }}
      >
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Hero / greeting skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-5 space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface, #FFFFFF)',
                border: '1px solid var(--border-default, #E2E8F0)',
              }}
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>

        {/* Chart + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart area */}
          <div
            className="lg:col-span-2 rounded-lg p-5 space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              border: '1px solid var(--border-default, #E2E8F0)',
            }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>

          {/* Sidebar list */}
          <div
            className="rounded-lg p-5 space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              border: '1px solid var(--border-default, #E2E8F0)',
            }}
          >
            <Skeleton className="h-5 w-36 rounded-md" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-5 space-y-4"
              style={{
                backgroundColor: 'var(--bg-surface, #FFFFFF)',
                border: '1px solid var(--border-default, #E2E8F0)',
              }}
            >
              <Skeleton className="h-5 w-32 rounded-md" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
