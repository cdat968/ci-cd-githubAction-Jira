// app/dashboard/attendance/page.tsx
import { Suspense } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { currentMonthRange } from '@/lib/utils'
import AttendanceFilters from '@/components/attendance/attendance-filters'
import AttendanceTableWrapper from '@/components/attendance/attendance-table-wrapper'
import type { AttendanceRow, Employee } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{
    dateFrom?: string
    dateTo?: string
    employeeId?: string
    status?: string
  }>
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = createSupabaseServerClient()
  const defaults = currentMonthRange()

  const dateFrom = params.dateFrom ?? defaults.from
  const dateTo = params.dateTo ?? defaults.to
  const employeeId = params.employeeId ?? ''
  const status = params.status ?? ''

  // Fetch employees for filter dropdown
  const { data: employees } = await supabase
    .from('employees')
    .select('id, code, full_name')
    .order('full_name')

  // Fetch attendance with employee join
  let query = supabase
    .from('attendance')
    .select('*, employees(code, full_name)')
    .gte('work_date', dateFrom)
    .lte('work_date', dateTo)
    .order('work_date', { ascending: false })
    .order('check_in_at', { ascending: false })

  if (employeeId) query = query.eq('employee_id', employeeId)
  if (status === 'late') query = query.eq('is_late', true)
  if (status === 'on_time') query = query.eq('is_late', false)

  const { data: rows } = await query

  return (
    <div>
      <Suspense fallback={null}>
        <AttendanceFilters
          employees={(employees ?? []) as Pick<Employee, 'id' | 'code' | 'full_name'>[]}
          dateFrom={dateFrom}
          dateTo={dateTo}
          employeeId={employeeId}
          status={status}
        />
      </Suspense>
      <AttendanceTableWrapper
        rows={(rows ?? []) as AttendanceRow[]}
        employees={(employees ?? []) as Pick<Employee, 'id' | 'code' | 'full_name'>[]}
      />
    </div>
  )
}
