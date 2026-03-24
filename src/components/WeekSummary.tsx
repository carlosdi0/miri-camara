import { formatHours } from '../utils/time'
import { MiriAvatar } from './MiriAvatar'

interface Props {
  totalHours: number
  filledHours: number
  remainingHours: number
  overtime: number
  suggestedPerDay: number
  emptyDays: number
  progress: number
  weekLabel: string
  dayIndex: number
  username: string
  isMiri: boolean
}

export function WeekSummary({
  totalHours,
  filledHours,
  remainingHours,
  overtime,
  suggestedPerDay,
  emptyDays,
  progress,
  weekLabel,
  dayIndex,
  username,
  isMiri,
}: Props) {
  const hasOvertime = overtime > 0

  return (
    <div className="week-summary">
      <div className="summary-header">
        <div>
          <h1 className="summary-title">La Jornada de {username || 'Miri'}</h1>
          <div className="summary-week-label">{weekLabel}</div>
        </div>
        {isMiri && <MiriAvatar dayIndex={dayIndex} />}
      </div>

      <div className={`progress-bar ${hasOvertime ? 'overtime' : ''}`}>
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="summary-stats">
        <div className="stat">
          <span className="stat-value">{formatHours(filledHours)}</span>
          <span className="stat-label">de {formatHours(totalHours)}</span>
        </div>
        {hasOvertime ? (
          <div className="stat stat-overtime">
            <span className="stat-value">+{formatHours(overtime)}</span>
            <span className="stat-label">extra</span>
          </div>
        ) : (
          <div className="stat">
            <span className="stat-value">{formatHours(remainingHours)}</span>
            <span className="stat-label">restantes</span>
          </div>
        )}
        {emptyDays > 0 && !hasOvertime && (
          <div className="stat">
            <span className="stat-value">~{formatHours(suggestedPerDay)}</span>
            <span className="stat-label">/{emptyDays} días</span>
          </div>
        )}
      </div>
    </div>
  )
}
