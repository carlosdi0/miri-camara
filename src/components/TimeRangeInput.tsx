import { calculateRange } from '../utils/time'
import type { DaySuggestion } from './DayCard'

interface Props {
  startTime: string
  endTime: string
  suggestion: DaySuggestion | null
  onChange: (start: string, end: string, hours: number | null) => void
}

export function TimeRangeInput({ startTime, endTime, suggestion, onChange }: Props) {
  const handleChange = (start: string, end: string) => {
    const hours = calculateRange(start, end)
    onChange(start, end, hours)
  }

  const showStartSuggestion = !startTime && suggestion
  const showEndSuggestion = !endTime && suggestion

  return (
    <div className="time-range-input">
      <div className="time-range-field">
        <input
          type="time"
          value={startTime}
          onChange={(e) => handleChange(e.target.value, endTime)}
          className={showStartSuggestion ? 'has-suggestion' : ''}
        />
        {showStartSuggestion && (
          <span className="time-suggestion">{suggestion.startTime}</span>
        )}
      </div>
      <span className="range-separator">—</span>
      <div className="time-range-field">
        <input
          type="time"
          value={endTime}
          onChange={(e) => handleChange(startTime, e.target.value)}
          className={showEndSuggestion ? 'has-suggestion' : ''}
        />
        {showEndSuggestion && (
          <span className="time-suggestion">{suggestion.endTime}</span>
        )}
      </div>
    </div>
  )
}
