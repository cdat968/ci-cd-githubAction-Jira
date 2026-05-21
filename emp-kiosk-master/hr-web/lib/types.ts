// lib/types.ts
export type Employee = {
  id: string
  code: string
  full_name: string
  enrolled_at: string | null
  is_active: boolean
  created_at: string
}

export type AttendanceSource = 'kiosk' | 'admin_manual'

export type AttendanceRow = {
  id: string
  employee_id: string
  work_date: string        // 'YYYY-MM-DD'
  check_in_at: string | null  // ISO timestamp
  check_out_at: string | null
  is_late: boolean
  source: AttendanceSource
  note: string | null
  modified_by: string | null
  created_at: string
  employees: Pick<Employee, 'code' | 'full_name'> | null  // joined
}

export type MonthlySummaryRow = {
  employee_id: string
  code: string
  full_name: string
  month: string       // 'YYYY-MM'
  days_worked: number
  days_late: number
  total_hours: number | null
}

export type Settings = {
  id: number
  work_start_time: string   // 'HH:MM'
  work_end_time: string
  late_grace_minutes: number
  confidence_threshold: number
  audit_photo_retention_days: number
}
