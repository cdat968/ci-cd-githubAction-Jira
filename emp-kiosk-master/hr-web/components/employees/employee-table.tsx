// components/employees/employee-table.tsx
'use client'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toggleEmployeeActive } from '@/app/actions/employees'
import { formatVNDate } from '@/lib/utils'
import type { Employee } from '@/lib/types'

interface EmployeeTableProps {
  employees: Employee[]
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  )

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleEmployeeActive(id, !current)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <Input
          placeholder="Tìm theo tên hoặc mã NV..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-xs">
            <TableHead>Mã NV</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Đã đăng ký khuôn mặt</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-400 py-10">
                Không có nhân viên
              </TableCell>
            </TableRow>
          )}
          {filtered.map(e => (
            <TableRow key={e.id}>
              <TableCell className="font-mono text-sm">{e.code}</TableCell>
              <TableCell className="text-sm">{e.full_name}</TableCell>
              <TableCell className="text-sm">
                {e.enrolled_at ? (
                  <span className="text-green-600">
                    {formatVNDate(e.enrolled_at.slice(0, 10))}
                  </span>
                ) : (
                  <span className="text-slate-400">Chưa đăng ký</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    e.is_active
                      ? 'border-green-400 text-green-700 bg-green-50'
                      : 'border-slate-300 text-slate-500'
                  }
                >
                  {e.is_active ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {formatVNDate(e.created_at.slice(0, 10))}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7"
                  disabled={isPending}
                  onClick={() => handleToggle(e.id, e.is_active)}
                >
                  {e.is_active ? 'Tạm dừng' : 'Kích hoạt'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
