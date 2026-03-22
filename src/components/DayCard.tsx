import type { DayData } from '../types'
import { formatHours } from '../utils/time'
import { TimeInput } from './TimeInput'
import { TimeRangeInput } from './TimeRangeInput'

export interface DaySuggestion {
  startTime: string
  endTime: string
  hours: number
}

interface Props {
  day: DayData
  index: number
  suggestion: DaySuggestion | null
  holidayHours: number
  onUpdate: (index: number, updates: Partial<DayData>) => void
}

export function DayCard({ day, index, suggestion, holidayHours, onUpdate }: Props) {
  const isToday = new Date().getDay() === index + 1 // 1=Monday

  const toggleHoliday = () => {
    onUpdate(index, {
      isHoliday: !day.isHoliday,
      hours: !day.isHoliday ? holidayHours : null,
    })
  }

  const toggleMode = () => {
    const newMode = day.mode === 'direct' ? 'range' : 'direct'
    onUpdate(index, {
      mode: newMode,
      hours: null,
      startTime: '',
      endTime: '',
    })
  }

  const displayHours = day.isHoliday
    ? holidayHours
    : day.hours

  const statusClass = day.isHoliday
    ? 'holiday'
    : day.hours !== null
      ? 'filled'
      : 'empty'

  return (
    <div className={`day-card ${statusClass} ${isToday ? 'today' : ''}`}>
      <div className="day-header">
        <span className="day-name">{day.name}</span>
        <div className="day-actions">
          {!day.isHoliday && (
            <button
              className={`mode-toggle ${day.mode}`}
              onClick={toggleMode}
              title={day.mode === 'direct' ? 'Cambiar a entrada/salida' : 'Cambiar a horas directas'}
            >
              <span className="material-symbols-rounded">{day.mode === 'direct' ? 'timer' : 'tag'}</span>
            </button>
          )}
          <button
            className={`holiday-toggle ${day.isHoliday ? 'active' : ''}`}
            onClick={toggleHoliday}
            title="Festivo / Teletrabajo"
          >
            <span className="material-symbols-rounded">beach_access</span>
            <span className="material-symbols-rounded">cottage</span>
          </button>
        </div>
      </div>

      <div className="day-body">
        {day.isHoliday ? (
          <div className="holiday-label">
            Festivo / Teletrabajo — {formatHours(holidayHours)}
          </div>
        ) : day.mode === 'direct' ? (
          <TimeInput
            hours={day.hours}
            onChange={(hours) => onUpdate(index, { hours })}
          />
        ) : (
          <TimeRangeInput
            startTime={day.startTime}
            endTime={day.endTime}
            suggestion={suggestion}
            onChange={(startTime, endTime, hours) =>
              onUpdate(index, { startTime, endTime, hours })
            }
          />
        )}
      </div>

      <div className="day-footer">
        {displayHours !== null ? (
          <span className="hours-done">
            <span className="material-symbols-rounded">check_circle</span>
            {formatHours(displayHours)}
          </span>
        ) : suggestion ? (
          <span className="hours-suggested">~{formatHours(suggestion.hours)}</span>
        ) : null}
      </div>
    </div>
  )
}
