export function validateAttendanceTime(
  checkIn: string,
  checkOut: string | null
): string | null {
  if (!checkOut) return null
  if (new Date(checkOut) <= new Date(checkIn)) {
    return 'Giờ ra phải sau giờ vào.'
  }
  return null
}
