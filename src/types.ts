export interface DayData {
  name: string
  mode: 'direct' | 'range'
  hours: number | null
  startTime: string
  endTime: string
  isHoliday: boolean
}

export interface WeekData {
  weekStart: string
  totalHours: number
  holidayHours: number
  days: DayData[]
}

export const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const

export const DEFAULT_TOTAL_HOURS = 38.75 // 38:45
export const DEFAULT_HOLIDAY_HOURS = 7.75 // 7:45

export function createEmptyWeek(weekStart: string): WeekData {
  return {
    weekStart,
    totalHours: DEFAULT_TOTAL_HOURS,
    holidayHours: DEFAULT_HOLIDAY_HOURS,
    days: DAY_NAMES.map((name) => ({
      name,
      mode: 'range' as const,
      hours: null,
      startTime: '',
      endTime: '',
      isHoliday: false,
    })),
  }
}
