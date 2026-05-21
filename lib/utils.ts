// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VN_TZ = 'Asia/Ho_Chi_Minh'

export function formatVNDate(dateStr: string): string {
  // dateStr is 'YYYY-MM-DD'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function formatVNTime(isoStr: string | null): string {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: VN_TZ,
  })
}

export function formatVNDateTime(isoStr: string | null): string {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: VN_TZ,
  })
}

/** Returns 'YYYY-MM-DD' for today in VN timezone */
export function todayVN(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: VN_TZ })
}

/** Convert 'YYYY-MM-DD' + 'HH:MM' into an ISO 8601 string at VN offset +07:00 */
export function vnDateTimeToISO(date: string, time: string): string {
  return `${date}T${time}:00+07:00`
}

/** Returns first and last day of current month as 'YYYY-MM-DD' */
export function currentMonthRange(): { from: string; to: string } {
  const now = new Date()
  const vnDateStr = now.toLocaleDateString('sv-SE', { timeZone: VN_TZ })
  const y = vnDateStr.slice(0, 4)
  const m = vnDateStr.slice(5, 7)
  const lastDay = new Date(Number(y), Number(m), 0).getDate()
  return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(lastDay).padStart(2, '0')}` }
}

/** Returns 'YYYY-MM' for current month in VN timezone */
export function currentMonth(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: VN_TZ }).slice(0, 7)
}
