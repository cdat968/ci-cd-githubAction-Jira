// lib/excel.ts
/// <reference lib="dom" />
import * as XLSX from 'xlsx'
import type { AttendanceRow, MonthlySummaryRow } from '@/lib/types'
import { formatVNDate, formatVNTime } from '@/lib/utils'

export function exportAttendance(rows: AttendanceRow[]) {
  const data = rows.map(r => ({
    'Ngày': formatVNDate(r.work_date),
    'Mã NV': r.employees?.code ?? '',
    'Họ tên': r.employees?.full_name ?? '',
    'Giờ vào': formatVNTime(r.check_in_at),
    'Giờ ra': formatVNTime(r.check_out_at),
    'Trạng thái': r.is_late ? 'Trễ' : 'Đúng giờ',
    'Nguồn': r.source === 'admin_manual' ? 'Thủ công' : 'Kiosk',
    'Ghi chú': r.note ?? '',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Chấm công')

  const dateStr = new Date().toLocaleDateString('sv-SE')
  XLSX.writeFile(wb, `cham-cong-${dateStr}.xlsx`)
}

export function exportMonthlyReport(rows: MonthlySummaryRow[], month: string) {
  const data = rows.map(r => ({
    'Mã NV': r.code,
    'Họ tên': r.full_name,
    'Ngày công': r.days_worked,
    'Ngày trễ': r.days_late,
    'Tổng giờ': r.total_hours ?? 0,
  }))

  // Totals row
  data.push({
    'Mã NV': '',
    'Họ tên': 'TỔNG',
    'Ngày công': rows.reduce((s, r) => s + r.days_worked, 0),
    'Ngày trễ': rows.reduce((s, r) => s + r.days_late, 0),
    'Tổng giờ': rows.reduce((s, r) => s + (r.total_hours ?? 0), 0),
  })

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `BC ${month}`)
  XLSX.writeFile(wb, `bao-cao-${month}.xlsx`)
}
