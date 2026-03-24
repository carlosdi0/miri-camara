import { useWeekData } from './hooks/useWeekData'
import { useUsername } from './hooks/useUsername'
import { WeekConfig } from './components/WeekConfig'
import { DayCard } from './components/DayCard'
import { WeekSummary } from './components/WeekSummary'
import { WelcomeOverlay } from './components/WelcomeOverlay'
import './app.css'

function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(start.getDate() + 4)
  const fmt = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  return `${fmt(start)} — ${fmt(end)}`
}

export default function App() {
  const {
    weekData,
    updateDay,
    setTotalHours,
    setHolidayHours,
    resetWeek,
    summary,
  } = useWeekData()
  const { username, saveUsername, isMiri } = useUsername()

  const dayIndex = Math.min(4, Math.max(0, new Date().getDay() - 1))

  return (
    <>
    <WelcomeOverlay username={username} onSaveName={saveUsername} isMiri={isMiri} />
    <div className="app">
      <div className="sidebar">
        <WeekSummary
          totalHours={weekData.totalHours}
          filledHours={summary.filledHours}
          remainingHours={summary.remainingHours}
          overtime={summary.overtime}
          suggestedPerDay={summary.suggestedPerDay}
          emptyDays={summary.emptyDays}
          progress={summary.progress}
          weekLabel={getWeekLabel(weekData.weekStart)}
          dayIndex={dayIndex}
          username={username}
          isMiri={isMiri}
        />

        <WeekConfig
          totalHours={weekData.totalHours}
          holidayHours={weekData.holidayHours}
          onTotalChange={setTotalHours}
          onHolidayChange={setHolidayHours}
          onReset={resetWeek}
        />
      </div>

      <div className="days-list">
        {weekData.days.map((day, i) => (
          <DayCard
            key={day.name}
            day={day}
            index={i}
            suggestion={summary.suggestions[i]}
            holidayHours={weekData.holidayHours}
            onUpdate={updateDay}
          />
        ))}
      </div>
    </div>
    </>
  )
}
