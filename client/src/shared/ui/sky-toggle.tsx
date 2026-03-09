import { useState } from "react"

interface SkyToggleProps {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export default function SkyToggle({
  defaultChecked = false,
  onChange,
}: SkyToggleProps) {
  const [isDay, setIsDay] = useState(defaultChecked)

  const toggle = () => {
    const next = !isDay
    setIsDay(next)
    onChange?.(next)
  }

  return (
    <button
      onClick={toggle}
      className="relative w-20 h-10 rounded-full transition-all duration-500 overflow-hidden"
      style={{
        background: isDay
          ? 'linear-gradient(135deg, #87CEEB, #4FC3F7)'
          : 'linear-gradient(135deg, #1a1a2e, #16213e)',
      }}
    >
      <span
        className="absolute top-1 w-8 h-8 rounded-full transition-all duration-500 flex items-center justify-center text-sm"
        style={{
          left: isDay ? '2.5rem' : '0.25rem',
          background: isDay ? '#FFD700' : '#C0C0C0',
          boxShadow: isDay
            ? '0 0 12px rgba(255, 215, 0, 0.6)'
            : '0 0 12px rgba(192, 192, 192, 0.4)',
        }}
      >
        {isDay ? '☀' : '☾'}
      </span>
    </button>
  )
}
