import { useState } from "react"

interface StarWarsToggleSwitchProps {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export default function StarWarsToggleSwitchDemo({
  defaultChecked = false,
  onChange,
}: StarWarsToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked)

  const toggle = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next)
  }

  return (
    <button
      onClick={toggle}
      className="relative w-16 h-8 rounded-full transition-colors duration-300"
      style={{
        backgroundColor: checked ? '#4ade80' : '#6b7280',
      }}
    >
      <span
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300"
        style={{
          transform: checked ? 'translateX(32px)' : 'translateX(0)',
        }}
      />
    </button>
  )
}
