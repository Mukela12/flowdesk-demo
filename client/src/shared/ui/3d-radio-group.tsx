import { useState } from "react"

interface RadioOption { value: string; label: string }
interface ThreeDRadioGroupProps {
  options: RadioOption[]
  defaultValue?: string
  onChange?: (value: string) => void
}

export default function ThreeDRadioGroup({ options, defaultValue, onChange }: ThreeDRadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value)
  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => { setSelected(opt.value); onChange?.(opt.value) }}
          className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
          style={{
            background: selected === opt.value ? 'var(--accent-500, #3B82F6)' : 'var(--bg-muted, #f1f5f9)',
            color: selected === opt.value ? '#fff' : 'var(--text-secondary, #64748b)',
            transform: selected === opt.value ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: selected === opt.value ? '0 8px 20px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
