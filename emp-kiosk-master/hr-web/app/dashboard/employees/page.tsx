// app/dashboard/employees/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import EmployeeTable from '@/components/employees/employee-table'
import type { Employee } from '@/lib/types'

export default async function EmployeesPage() {
  const supabase = createSupabaseServerClient()
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .order('full_name')

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Danh sách nhân viên</h2>
      <EmployeeTable employees={(employees ?? []) as Employee[]} />
    </div>
  )
}
