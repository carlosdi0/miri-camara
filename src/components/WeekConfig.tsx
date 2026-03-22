import { useState, useEffect } from 'react'
import { formatHours, parseHours } from '../utils/time'

interface Props {
  totalHours: number
  holidayHours: number
  onTotalChange: (h: number) => void
  onHolidayChange: (h: number) => void
  onReset: () => void
}

export function WeekConfig({
  totalHours,
  holidayHours,
  onTotalChange,
  onHolidayChange,
  onReset,
}: Props) {
  const [totalVal, setTotalVal] = useState(formatHours(totalHours))
  const [holidayVal, setHolidayVal] = useState(formatHours(holidayHours))

  useEffect(() => {
    setTotalVal(formatHours(totalHours))
  }, [totalHours])

  useEffect(() => {
    setHolidayVal(formatHours(holidayHours))
  }, [holidayHours])

  return (
    <div className="week-config">
      <div className="config-row">
        <label>
          Horas semanales
          <input
            type="text"
            inputMode="decimal"
            value={totalVal}
            onChange={(e) => setTotalVal(e.target.value)}
            onBlur={() => {
              const v = parseHours(totalVal)
              if (v !== null) {
                onTotalChange(v)
                setTotalVal(formatHours(v))
              } else {
                setTotalVal(formatHours(totalHours))
              }
            }}
          />
        </label>
        <label>
          Horas festivo
          <input
            type="text"
            inputMode="decimal"
            value={holidayVal}
            onChange={(e) => setHolidayVal(e.target.value)}
            onBlur={() => {
              const v = parseHours(holidayVal)
              if (v !== null) {
                onHolidayChange(v)
                setHolidayVal(formatHours(v))
              } else {
                setHolidayVal(formatHours(holidayHours))
              }
            }}
          />
        </label>
      </div>
      <button className="reset-btn" onClick={onReset}>
        Nueva semana
      </button>
    </div>
  )
}
