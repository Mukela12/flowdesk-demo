import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface WrapShaderProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Intensity of the gradient effect (0-1). Default 0.6 */
  intensity?: number
}

/**
 * Visual wrapper that simulates a shader-like gradient effect.
 * Replaces @paper-design/shaders-react with a pure CSS fallback.
 */
export default function WrapShader({
  children,
  className,
  style,
  intensity = 0.6,
}: WrapShaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        className
      )}
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(124, 92, 252, ${intensity * 0.15}) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, ${intensity * 0.12}) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(251, 113, 133, ${intensity * 0.1}) 0%, transparent 50%),
          hsl(var(--card))
        `,
        ...style,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${intensity * 40}px)`,
          background: 'linear-gradient(135deg, transparent 30%, hsl(var(--card) / 0.4) 100%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
