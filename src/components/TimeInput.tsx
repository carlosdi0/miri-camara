import { useState, useEffect } from 'react'
import { formatHours, parseHours } from '../utils/time'

interface Props {
  hours: number | null
  onChange: (hours: number | null) => void
}

export function TimeInput({ hours, onChange }: Props) {
  const [value, setValue] = useState(hours !== null ? formatHours(hours) : '')

  useEffect(() => {
    setValue(hours !== null ? formatHours(hours) : '')
  }, [hours])

  const handleBlur = () => {
    if (!value.trim()) {
      onChange(null)
      return
    }
    const parsed = parseHours(value)
    if (parsed !== null) {
      onChange(parsed)
      setValue(formatHours(parsed))
    } else {
      setValue(hours !== null ? formatHours(hours) : '')
    }
  }

  return (
    <div className="time-input">
      <input
        type="text"
        inputMode="decimal"
        placeholder="0:00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  )
}
