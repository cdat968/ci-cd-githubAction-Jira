// components/attendance/attendance-table.tsx
'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { formatVNDate, formatVNTime } from '@/lib/utils'
import type { AttendanceRow, Employee } from '@/lib/types'

interface AttendanceTableProps {
  rows: AttendanceRow[]
  employees: Pick<Employee, 'id' | 'code' | 'full_name'>[]
  onAdd: () => void
  onEdit: (row: AttendanceRow) => void
  onExport: () => void
}

export default function AttendanceTable({
  rows,
  employees,
  onAdd,
  onEdit,
  onExport,
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-500">{rows.length} bản ghi</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onExport}>
            Xuất Excel
          </Button>
          <Button size="sm" className="bg-[#1d4ed8] hover:bg-[#1e3a8a]" onClick={onAdd}>
            + Thêm
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-xs">
            <TableHead>Ngày</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Giờ vào</TableHead>
            <TableHead>Giờ ra</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Nguồn</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Người sửa</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-slate-400 py-10">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
          {rows.map(row => (
            <TableRow
              key={row.id}
              className={row.source === 'admin_manual' ? 'border-l-2 border-l-purple-400' : ''}
            >
              <TableCell className="text-sm">{formatVNDate(row.work_date)}</TableCell>
              <TableCell className="text-sm">
                <div>{row.employees?.full_name ?? '—'}</div>
                <div className="text-xs text-slate-400">{row.employees?.code}</div>
              </TableCell>
              <TableCell className="text-sm">{formatVNTime(row.check_in_at)}</TableCell>
              <TableCell className="text-sm">{formatVNTime(row.check_out_at)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    row.is_late
                      ? 'border-amber-400 text-amber-700 bg-amber-50'
                      : 'border-green-400 text-green-700 bg-green-50'
                  }
                >
                  {row.is_late ? 'Trễ' : 'Đúng giờ'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    row.source === 'admin_manual'
                      ? 'border-purple-400 text-purple-700 bg-purple-50'
                      : 'border-slate-300 text-slate-600'
                  }
                >
                  {row.source === 'admin_manual' ? 'Thủ công' : 'Kiosk'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-500 max-w-[120px] truncate">
                {row.note ?? ''}
              </TableCell>
              <TableCell className="text-xs text-slate-400">
                {row.modified_by ?? ''}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7"
                  onClick={() => onEdit(row)}
                >
                  Sửa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
