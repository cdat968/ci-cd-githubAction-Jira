// components/attendance/attendance-filters.tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/types'

interface AttendanceFiltersProps {
  employees: Pick<Employee, 'id' | 'code' | 'full_name'>[]
  dateFrom: string
  dateTo: string
  employeeId: string
  status: string
}

export default function AttendanceFilters({
  employees,
  dateFrom,
  dateTo,
  employeeId,
  status,
}: AttendanceFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500">Từ ngày</label>
        <Input
          type="date"
          value={dateFrom}
          onChange={e => setParam('dateFrom', e.target.value)}
          className="w-36 bg-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500">Đến ngày</label>
        <Input
          type="date"
          value={dateTo}
          onChange={e => setParam('dateTo', e.target.value)}
          className="w-36 bg-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500">Nhân viên</label>
        <Select
          value={employeeId || 'all'}
          onValueChange={v => setParam('employeeId', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {employees.map(e => (
              <SelectItem key={e.id} value={e.id}>
                {e.full_name} ({e.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500">Trạng thái</label>
        <Select
          value={status || 'all'}
          onValueChange={v => setParam('status', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-36 bg-white">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="on_time">Đúng giờ</SelectItem>
            <SelectItem value="late">Trễ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-white"
        onClick={() => router.push(pathname)}
      >
        Xóa lọc
      </Button>
    </div>
  )
}
