import { cn } from '@/shared/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md',
        className,
      )}
      style={{ backgroundColor: 'var(--bg-muted, #E2E8F0)' }}
      {...props}
    />
  )
}

export { Skeleton }
