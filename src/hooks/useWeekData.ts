import { useState, useEffect, useCallback, useMemo } from 'react'
import type { WeekData, DayData } from '../types'
import { createEmptyWeek } from '../types'
import { getCurrentWeekStart, calculateRange } from '../utils/time'

const STORAGE_KEY = 'miri-camara-week'

function loadFromStorage(): WeekData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as WeekData
      const currentWeek = getCurrentWeekStart()
      if (data.weekStart === currentWeek) {
        return data
      }
    }
  } catch {
    // ignore
  }
  return createEmptyWeek(getCurrentWeekStart())
}

function saveToStorage(data: WeekData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useWeekData() {
  const [weekData, setWeekData] = useState<WeekData>(loadFromStorage)

  useEffect(() => {
    saveToStorage(weekData)
  }, [weekData])

  const updateDay = useCallback((index: number, updates: Partial<DayData>) => {
    setWeekData((prev) => {
      const days = [...prev.days]
      days[index] = { ...days[index], ...updates }
      return { ...prev, days }
    })
  }, [])

  const setTotalHours = useCallback((totalHours: number) => {
    setWeekData((prev) => ({ ...prev, totalHours }))
  }, [])

  const setHolidayHours = useCallback((holidayHours: number) => {
    setWeekData((prev) => ({ ...prev, holidayHours }))
  }, [])

  const resetWeek = useCallback(() => {
    setWeekData(createEmptyWeek(getCurrentWeekStart()))
  }, [])

  const summary = useMemo(() => {
    const { days, totalHours } = weekData
    const defaultStartMinutes = 8 * 60 // 08:00

    let filledHours = 0
    let endConstrainedHours = 0

    // Classify each day
    const dayStates = days.map((day) => {
      if (day.isHoliday) {
        filledHours += weekData.holidayHours
        return 'holiday' as const
      }
      if (day.hours !== null) {
        filledHours += day.hours
        return 'filled' as const
      }
      // Fixed exit (endTime set, no startTime): hours are known
      if (day.endTime && !day.startTime) {
        const h = calculateRange('08:00', day.endTime)
        if (h !== null && h > 0) {
          endConstrainedHours += h
          return 'end-fixed' as const
        }
      }
      // Custom start (startTime set, no endTime): participates in common end calc
      if (day.startTime && !day.endTime) {
        return 'start-fixed' as const
      }
      return 'free' as const
    })

    // Collect start-fixed days' start times (in minutes)
    const startFixedMinutes: number[] = []
    let freeDays = 0
    days.forEach((day, i) => {
      if (dayStates[i] === 'start-fixed') {
        const [h, m] = day.startTime.split(':').map(Number)
        startFixedMinutes.push(h * 60 + m)
      } else if (dayStates[i] === 'free') {
        freeDays++
      }
    })

    const participatingDays = freeDays + startFixedMinutes.length
    const remainingAfterFixed = totalHours - filledHours - endConstrainedHours

    // Calculate common end time for free + start-fixed days
    // (n+m)*E = remaining + 8n + sum(s_i)  (all in hours)
    let commonEndMinutes = 0
    let suggestedPerFreeDay = 0

    if (participatingDays > 0 && remainingAfterFixed > 0) {
      const sumStartMinutes = startFixedMinutes.reduce((a, b) => a + b, 0)
      commonEndMinutes = Math.round(
        (remainingAfterFixed * 60 + freeDays * defaultStartMinutes + sumStartMinutes) /
          participatingDays,
      )
      suggestedPerFreeDay = (commonEndMinutes - defaultStartMinutes) / 60
    }

    const fmtTime = (minutes: number) => {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    }

    // Build per-day suggestions
    const suggestions = days.map((day, i) => {
      const state = dayStates[i]
      if (state === 'holiday' || state === 'filled') return null
      if (state === 'end-fixed') {
        const h = calculateRange('08:00', day.endTime)!
        return { startTime: '08:00', endTime: day.endTime, hours: h }
      }
      if (participatingDays === 0 || remainingAfterFixed <= 0) return null
      if (state === 'start-fixed') {
        const [h, m] = day.startTime.split(':').map(Number)
        const startMin = h * 60 + m
        const hours = (commonEndMinutes - startMin) / 60
        return {
          startTime: day.startTime,
          endTime: fmtTime(commonEndMinutes),
          hours: Math.max(0, hours),
        }
      }
      // free day
      return {
        startTime: '08:00',
        endTime: fmtTime(commonEndMinutes),
        hours: Math.max(0, suggestedPerFreeDay),
      }
    })

    const remainingHours = Math.max(0, totalHours - filledHours)
    const overtime = totalHours - filledHours < 0 ? Math.abs(totalHours - filledHours) : 0
    const emptyDays = participatingDays + dayStates.filter((s) => s === 'end-fixed').length
    const progress = totalHours > 0 ? Math.min(100, (filledHours / totalHours) * 100) : 0

    return {
      filledHours,
      remainingHours,
      overtime,
      emptyDays,
      suggestedPerDay: suggestedPerFreeDay,
      suggestions,
      progress,
    }
  }, [weekData])

  return {
    weekData,
    updateDay,
    setTotalHours,
    setHolidayHours,
    resetWeek,
    summary,
  }
}
