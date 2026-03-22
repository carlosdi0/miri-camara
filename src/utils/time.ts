/** Parse "7:30" or "7.5" or "7,5" to decimal hours (7.5) */
export function parseHours(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Format HH:MM
  if (trimmed.includes(':')) {
    const [hStr, mStr] = trimmed.split(':')
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr || '0', 10)
    if (isNaN(h) || isNaN(m)) return null
    return h + m / 60
  }

  // Format decimal with comma or dot
  const num = parseFloat(trimmed.replace(',', '.'))
  return isNaN(num) ? null : num
}

/** Format decimal hours to "H:MM" (e.g. 7.5 -> "7:30") */
export function formatHours(decimal: number): string {
  const h = Math.floor(decimal)
  const m = Math.round((decimal - h) * 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

/** Calculate hours between two time strings "HH:MM" */
export function calculateRange(start: string, end: string): number | null {
  const startMin = parseTimeToMinutes(start)
  const endMin = parseTimeToMinutes(end)
  if (startMin === null || endMin === null) return null
  if (endMin <= startMin) return null
  return (endMin - startMin) / 60
}

function parseTimeToMinutes(time: string): number | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

/** Calculate end time given a start time and hours to add */
export function addHoursToTime(start: string, hours: number): string {
  const startMin = parseTimeToMinutes(start)
  if (startMin === null) return ''
  const endMin = startMin + Math.round(hours * 60)
  const h = Math.floor(endMin / 60)
  const m = endMin % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/** Get the ISO date string for the Monday of the current week */
export function getCurrentWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}
