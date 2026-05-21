// components/reports/report-table.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { exportMonthlyReport } from '@/lib/excel'
import type { MonthlySummaryRow } from '@/lib/types'

interface ReportTableProps {
  rows: MonthlySummaryRow[]
  month: string
}

export default function ReportTable({ rows, month }: ReportTableProps) {
  const router = useRouter()
  const pathname = usePathname()

  const totalDaysWorked = rows.reduce((s, r) => s + r.days_worked, 0)
  const totalDaysLate = rows.reduce((s, r) => s + r.days_late, 0)
  const totalHours = rows.reduce((s, r) => s + (r.total_hours ?? 0), 0)

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Tháng</label>
          <Input
            type="month"
            value={month}
            onChange={e => {
              const params = new URLSearchParams()
              params.set('month', e.target.value)
              router.push(`${pathname}?${params.toString()}`)
            }}
            className="w-40 bg-white"
          />
        </div>
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={() => exportMonthlyReport(rows, month)}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 text-xs">
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead className="text-right">Ngày công</TableHead>
              <TableHead className="text-right">Ngày trễ</TableHead>
              <TableHead className="text-right">Tổng giờ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-10">
                  Không có dữ liệu tháng này
                </TableCell>
              </TableRow>
            )}
            {rows.map(r => (
              <TableRow key={r.employee_id}>
                <TableCell className="font-mono text-sm">{r.code}</TableCell>
                <TableCell className="text-sm">{r.full_name}</TableCell>
                <TableCell className="text-right text-sm">{r.days_worked}</TableCell>
                <TableCell className="text-right text-sm">
                  <span className={r.days_late > 0 ? 'text-amber-600 font-medium' : ''}>
                    {r.days_late}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm">
                  {r.total_hours != null ? r.total_hours.toFixed(1) : '0.0'}h
                </TableCell>
              </TableRow>
            ))}
            {rows.length > 0 && (
              <TableRow className="bg-slate-50 font-semibold border-t-2 border-slate-200">
                <TableCell colSpan={2} className="text-sm">TỔNG CỘNG</TableCell>
                <TableCell className="text-right text-sm">{totalDaysWorked}</TableCell>
                <TableCell className="text-right text-sm text-amber-600">{totalDaysLate}</TableCell>
                <TableCell className="text-right text-sm">{totalHours.toFixed(1)}h</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
