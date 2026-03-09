import { useEffect, useRef, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

/**
 * Tracks mouse position normalized to -1..1 range with lerp smoothing.
 * Returns {x:0, y:0} if user prefers reduced motion.
 */
export function useMousePosition(lerpFactor = 0.08): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })
  const targetRef = useRef<MousePosition>({ x: 0, y: 0 })
  const currentRef = useRef<MousePosition>({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }

    const animate = () => {
      const cur = currentRef.current
      const tgt = targetRef.current

      cur.x += (tgt.x - cur.x) * lerpFactor
      cur.y += (tgt.y - cur.y) * lerpFactor

      setPosition({ x: cur.x, y: cur.y })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [lerpFactor])

  return position
}
