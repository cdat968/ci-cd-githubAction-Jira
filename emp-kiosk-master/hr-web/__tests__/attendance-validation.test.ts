import { validateAttendanceTime } from '@/lib/attendance-validation'

describe('validateAttendanceTime', () => {
  test('checkOut null → hợp lệ (không bắt buộc)', () => {
    const result = validateAttendanceTime('2026-05-21T09:00:00+07:00', null)
    expect(result).toBeNull()
  })

  test('checkOut sau checkIn → hợp lệ', () => {
    const result = validateAttendanceTime(
      '2026-05-21T09:00:00+07:00',
      '2026-05-21T17:00:00+07:00'
    )
    expect(result).toBeNull()
  })

  test('checkOut trước checkIn → lỗi', () => {
    const result = validateAttendanceTime(
      '2026-05-21T09:00:00+07:00',
      '2026-05-21T08:00:00+07:00'
    )
    expect(result).toBe('Giờ ra phải sau giờ vào.')
  })

  test('checkOut bằng checkIn → lỗi (dấu <= trong code)', () => {
    const result = validateAttendanceTime(
      '2026-05-21T09:00:00+07:00',
      '2026-05-21T09:00:00+07:00'
    )
    expect(result).toBe('Giờ ra phải sau giờ vào.')
  })
})
